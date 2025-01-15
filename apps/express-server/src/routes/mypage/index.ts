import express from 'express';
import bcrypt from 'bcrypt';
import axios from 'axios';
import { User } from '@/models';
import { authMiddleware } from '@/middleware/authMiddleware';
import { MYPAGE_MESSAGES } from '@/constants/mypage_message';
import { AUTH_MESSAGES } from '@/constants/auth_message';

const router = express.Router();

const validateInput = (type: string, value: string) => {
  if (type === 'username') {
    if (!value || value.length < 3 || value.length > 30) {
      return AUTH_MESSAGES.USERNAME_INVALID;
    }
  }

  if (type === 'password') {
    if (!value || value.length < 8) {
      return AUTH_MESSAGES.PASSWORD_INVALID;
    }
  }

  if (type === 'confirmPassword') {
    if (!value) {
      return AUTH_MESSAGES.PASSWORD_CONFIRMATION;
    }
  }

  return null;
};

// 닉네임 조회
router.get('/me/username', authMiddleware, async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['username'],
    });

    if (!user) {
      return res.status(404).json({ error: MYPAGE_MESSAGES.USER_NOT_FOUND });
    }

    return res.status(200).json({ username: user.username });
  } catch (error) {
    console.error('Error fetching username:', error);
    return res.status(500).json({ error: MYPAGE_MESSAGES.USERNAME_FETCH_ERROR });
  }
});

// 닉네임 변경
router.put('/me/username', authMiddleware, async (req, res) => {
  const { nickname } = req.body;
  const userId = req.user?.id;

  const validationError = validateInput('username', nickname);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    await User.update({ username: nickname }, { where: { id: userId } });
    return res.status(200).json({ message: MYPAGE_MESSAGES.NICKNAME_UPDATE_SUCCESS });
  } catch (error) {
    console.error('Error updating username:', error);
    return res.status(500).json({ error: MYPAGE_MESSAGES.NICKNAME_UPDATE_ERROR });
  }
});

// 비밀번호 변경
router.put('/me/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user?.id;

  let validationError = validateInput('password', newPassword);
  if (!validationError) {
    validationError = validateInput('confirmPassword', confirmPassword);
  }
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'password', 'provider'],
      raw: true,
    });

    if (!user) {
      return res.status(404).json({ message: MYPAGE_MESSAGES.USER_NOT_FOUND });
    }

    if (user.provider !== 'credentials') {
      return res.status(400).json({ message: MYPAGE_MESSAGES.SOCIAL_PASSWORD_ERROR });
    }

    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ message: MYPAGE_MESSAGES.PASSWORD_MISMATCH });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: MYPAGE_MESSAGES.PASSWORD_CONFIRMATION_ERROR });
    }

    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({ message: MYPAGE_MESSAGES.PASSWORD_SAME_AS_OLD });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    return res.status(200).json({ message: MYPAGE_MESSAGES.PASSWORD_UPDATE_SUCCESS });
  } catch (error) {
    console.error('Error updating password:', error);
    return res.status(500).json({ message: MYPAGE_MESSAGES.PASSWORD_UPDATE_ERROR });
  }
});

// 회원탈퇴
router.delete('/me', authMiddleware, async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['id', 'provider', 'googleId', 'username'],
      raw: true,
    });

    if (!user) {
      return res.status(404).json({ message: MYPAGE_MESSAGES.USER_NOT_FOUND });
    }

    await User.destroy({ where: { id: userId } });
    console.log(`User account deleted: userId=${userId}, username=${user.username}`);

    return res.status(200).json({ message: MYPAGE_MESSAGES.DELETE_ACCOUNT_SUCCESS });
  } catch (error) {
    console.error('Error deleting account:', error);
    return res.status(500).json({ message: MYPAGE_MESSAGES.DELETE_ACCOUNT_ERROR });
  }
});

// 이메일 조회
router.get('/me/email', authMiddleware, async (req, res) => {
  const userId = req.user?.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['email'],
    });

    if (!user) {
      return res.status(404).json({ error: MYPAGE_MESSAGES.USER_NOT_FOUND });
    }

    return res.status(200).json({ email: user.email });
  } catch (error) {
    console.error('Error fetching email:', error);
    return res.status(500).json({ error: MYPAGE_MESSAGES.EMAIL_FETCH_ERROR });
  }
});

// Google 계정 연결 해제
const GOOGLE_REVOKE_URL = 'https://oauth2.googleapis.com/revoke';

router.post('/me/disconnectGoogle', authMiddleware, async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: MYPAGE_MESSAGES.GOOGLE.DISCONNECT_ERROR });
  }

  try {
    const response = await axios.post(`${GOOGLE_REVOKE_URL}?token=${token}`);

    if (response.status === 200) {
      return res.status(200).json({ message: MYPAGE_MESSAGES.GOOGLE.DISCONNECT_SUCCESS });
    } else {
      return res.status(response.status).json({ message: MYPAGE_MESSAGES.GOOGLE.DISCONNECT_FAILED });
    }
  } catch (error) {
    console.error('Error during Google account revocation:', error);
    return res.status(500).json({ message: MYPAGE_MESSAGES.GOOGLE.DISCONNECT_ERROR });
  }
});

export default router;
