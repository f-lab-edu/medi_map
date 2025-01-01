import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '@/models';
import { authMiddleware } from '@/middleware/authMiddleware';
import { MYPAGE_MESSAGES } from '@/constants/mypage_message';

const router = express.Router();

// 닉네임 조회
router.get('/me/username', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId, {
      attributes: ['username'],
    });

    if (!user) {
      return res.status(404).json({ error: MYPAGE_MESSAGES.USER_NOT_FOUND });
    }

    return res.status(200).json({ username: user.username });
  } catch (error) {
    return res.status(500).json({ error: MYPAGE_MESSAGES.USERNAME_FETCH_ERROR });
  }
});

// 닉네임 변경경
router.put('/me/username', authMiddleware, async (req, res) => {
  const { nickname } = req.body;
  const userId = req.user.id;

  try {
    await User.update({ username: nickname }, { where: { id: userId } });
    return res.status(200).json({ message: MYPAGE_MESSAGES.NICKNAME_UPDATE_SUCCESS });
  } catch (error) {
    return res.status(500).json({ error: MYPAGE_MESSAGES.NICKNAME_UPDATE_ERROR });
  }
});

// 비밀번호 변경
router.put('/me/password', authMiddleware, async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    // 사용자 정보 조회
    const user = await User.findByPk(userId, {
      attributes: ['id', 'username', 'email', 'password', 'provider'],
      raw: true,
    });

    if (!user) {
      return res.status(404).json({
        code: 'USER_NOT_FOUND',
        message: MYPAGE_MESSAGES.USER_NOT_FOUND,
      });
    }

    // 소셜 로그인 사용자는 비밀번호 변경 불가
    if (user.provider !== 'credentials') {
      return res.status(400).json({
        code: 'SOCIAL_PASSWORD_ERROR',
        message: MYPAGE_MESSAGES.SOCIAL_PASSWORD_ERROR,
      });
    }

    // 현재 비밀번호 검증
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({
        code: 'PASSWORD_MISMATCH',
        message: MYPAGE_MESSAGES.PASSWORD_MISMATCH,
      });
    }

    // 새 비밀번호와 확인 비밀번호 일치 여부 검증
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        code: 'PASSWORD_CONFIRMATION_ERROR',
        message: MYPAGE_MESSAGES.PASSWORD_CONFIRMATION_ERROR,
      });
    }

    // 새 비밀번호가 기존 비밀번호와 동일한지 검증
    if (await bcrypt.compare(newPassword, user.password)) {
      return res.status(400).json({
        code: 'PASSWORD_SAME_AS_OLD',
        message: MYPAGE_MESSAGES.PASSWORD_SAME_AS_OLD,
      });
    }

    // 비밀번호 업데이트
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    return res.status(200).json({
      code: 'PASSWORD_UPDATE_SUCCESS',
      message: MYPAGE_MESSAGES.PASSWORD_UPDATE_SUCCESS,
    });
  } catch (error) {
    console.error(MYPAGE_MESSAGES.PASSWORD_UPDATE_ERROR, error);
    return res.status(500).json({
      code: 'PASSWORD_UPDATE_ERROR',
      message: MYPAGE_MESSAGES.PASSWORD_UPDATE_ERROR,
    });
  }
});

// 회원탈퇴
router.delete('/me', authMiddleware, async (req, res) => {
  const userId = req.user.id;

  try {
    // 사용자 정보 확인
    const user = await User.findByPk(userId, {
      attributes: ['id', 'provider', 'googleId', 'username'],
      raw: true,
    });

    if (!user) {
      return res.status(404).json({
        code: 'USER_NOT_FOUND',
        message: MYPAGE_MESSAGES.USER_NOT_FOUND,
      });
    }

    // 사용자 삭제
    await User.destroy({ where: { id: userId } });
    console.log(`회원탈퇴 성공: userId = ${userId}, username = ${user.username}`);

    return res.status(200).json({
      code: 'DELETE_ACCOUNT_SUCCESS',
      message: `${user.username}님의 계정이 성공적으로 삭제되었습니다.`,
    });
  } catch (error) {
    console.error('Error deleting user account:', error);
    return res.status(500).json({
      code: 'DELETE_ACCOUNT_ERROR',
      message: MYPAGE_MESSAGES.DELETE_ACCOUNT_ERROR,
    });
  }
});

// 이메일 조회
router.get('/me/email', authMiddleware, async (req, res) => {
  const userId = req.user.id;

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


export default router;
