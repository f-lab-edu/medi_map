import { User } from '@/models';

// 사용자 생성 함수
export const createUser = async (username: string, email: string, password: string) => {
  try {
    const user = await User.create({
      username,
      email,
      password,
    });
    return user;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

// 이메일로 사용자 찾기 함수
export const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({
      where: { email },
    });
    return user;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

// Google ID로 사용자 찾기 함수
export const findUserByGoogleId = async (googleId: string) => {
  try {
    const user = await User.findOne({
      where: { googleId },
    });
    return user;
  } catch (error) {
    console.error('Error finding user by Google ID:', error);
    throw error;
  }
};
