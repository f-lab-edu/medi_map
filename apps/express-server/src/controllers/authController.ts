import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../app-constants/constants';
import { createUser, findUserByEmail } from '../services/authService';

// 회원가입 컨트롤러
export const signup = async (req: Request, res: Response): Promise<Response> => {
  const { username, email, password } = req.body;

  try {
    // 1. 사용자 이메일 중복 체크
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: '이미 존재하는 이메일입니다.' });
    }

    // 2. 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. 사용자 생성
    const newUser = await createUser(username, email, hashedPassword);

    // 4. 토큰 생성
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(201).json({ token, user: newUser });
  } catch (error) {
    console.error('회원가입 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.', error: (error as Error).message });
  }
};

// 로그인 컨트롤러
export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    // 1. 사용자 이메일로 검색
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(400).json({ message: '이메일이나 비밀번호를 다시 확인해주세요.' });
    }

    // 2. 비밀번호 비교
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: '이메일이나 비밀번호를 다시 확인해주세요.' });
    }

    // 3. 토큰 생성
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return res.status(200).json({ token, user });
  } catch (error) {
    console.error('로그인 오류:', error);
    return res.status(500).json({ message: '서버 오류가 발생했습니다.', error: (error as Error).message });
  }
};
