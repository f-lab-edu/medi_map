'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ROUTES , API_URLS } from '@/constants/urls';
import Cookies from 'js-cookie';
import axios from 'axios';

export default function Header() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      const refreshToken = Cookies.get('refreshToken'); // 쿠키에서 리프레시 토큰 가져오기
      if (refreshToken) {
        // 백엔드로 로그아웃 요청
        await axios.post(API_URLS.LOGOUT, { refreshToken });
        Cookies.remove('refreshToken'); // 쿠키에서 리프레시 토큰 제거
      }

      Cookies.remove('accessToken'); // 액세스 토큰도 제거
      signOut({ callbackUrl: ROUTES.AUTH.SIGN_IN });
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return (
    <header id="header">
      <div className="inner">
        <h1>
          <Link href="/">MediMap+</Link>
        </h1>
        <div className="right_cont">
          <ul className="menu_cont">
            <li><Link href="/search">약 정보 검색</Link></li>
            <li><Link href="/pharmacy">약국 찾아보기</Link></li>
            <li><Link href="/community">건강 이야기</Link></li>
          </ul>
          <ul className="auth_cont">
            {session ? (
              <>
                <li>
                  <button onClick={handleLogout}>로그아웃</button>
                </li>
                <li><Link href="/mypage">마이페이지</Link></li>
              </>
            ) : (
              <>
                <li className='login_button'><Link href="/auth/login">로그인</Link></li>
                <li className='sign_up_button'><Link href="/auth/signup">회원가입</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}