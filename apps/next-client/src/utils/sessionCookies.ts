import Cookies from 'js-cookie';

interface UserSession {
  id: string;
  accessToken: string;
  refreshToken?: string;
}

export const setSessionCookies = (user: UserSession) => {
  Cookies.set('userId', user.id, {
    secure: true,
    sameSite: 'Strict',
  });

  Cookies.set('accessToken', user.accessToken, {
    secure: true,
    sameSite: 'Strict',
  });

  if (user.refreshToken) {
    Cookies.set('refreshToken', user.refreshToken, {
      secure: true,
      sameSite: 'Strict',
    });
  }
};