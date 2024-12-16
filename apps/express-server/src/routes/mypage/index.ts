import express from 'express';
import bcrypt from 'bcrypt';
import { User } from '@/models';

const router = express.Router();

router.put('/me/nickname', async (req, res) => {
  const { nickname } = req.body;
  const userId = req.user.id;

  try {
    await User.update({ nickname }, { where: { id: userId } });
    return res.status(200).json({ message: '닉네임이 성공적으로 변경되었습니다.' });
  } catch (error) {
    return res.status(500).json({ error: '닉네임 변경 중 오류가 발생했습니다.' });
  }
});

router.put('/me/password', async (req, res) => {
  const { oldPassword, newPassword, confirmPassword } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findByPk(userId);

    // 소셜 로그인 사용자는 비밀번호 수정 불가
    if (user.provider !== 'credentials') {
      return res.status(400).json({ error: '소셜 로그인 사용자는 비밀번호를 수정할 수 없습니다.' });
    }

    // 비밀번호 확인
    if (!(await bcrypt.compare(oldPassword, user.password))) {
      return res.status(400).json({ error: '현재 비밀번호가 일치하지 않습니다.' });
    }
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: '새 비밀번호가 일치하지 않습니다.' });
    }

    // 새 비밀번호 저장
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { id: userId } });

    return res.status(200).json({ message: '비밀번호가 성공적으로 변경되었습니다.' });
  } catch (error) {
    return res.status(500).json({ error: '비밀번호 변경 중 오류가 발생했습니다.' });
  }
});

router.delete('/me', async (req, res) => {
  const userId = req.user.id;

  try {
    await User.destroy({ where: { id: userId } });
    return res.status(200).json({ message: '회원탈퇴가 완료되었습니다.' });
  } catch (error) {
    return res.status(500).json({ error: '회원탈퇴 중 오류가 발생했습니다.' });
  }
});

export default router;
