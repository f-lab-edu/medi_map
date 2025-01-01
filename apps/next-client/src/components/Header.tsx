'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ROUTES, API_URLS } from '@/constants/urls';
import Cookies from 'js-cookie';
import axios from 'axios';
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();

  const handleLogout = async () => {
    try {
      if (session?.user.id) {
        await axios.post(API_URLS.LOGOUT, {
          userId: session.user.id,
        });
      }
      Cookies.remove('accessToken');

      signOut({ callbackUrl: ROUTES.AUTH.SIGN_IN });
    } catch (error) {
      console.error('Failed to logout:', error);
      signOut({ callbackUrl: ROUTES.AUTH.SIGN_IN });
    }
  };

  return (
    <header id="header">
      <div className="inner">
        <h1>
          <Link href="/">MediMap+</Link>
          <Image src="/images/icon-medicine.webp" alt="logo" width={500} height={300} />
        </h1>
        <div className="right_cont">
          <ul className="menu_cont">
            <li><Link href="/search">약 정보 검색</Link></li>
            <li><Link href="/pharmacy">약국 찾아보기</Link></li>
            <li><Link href="/community">건강 이야기</Link></li>
          </ul>
          <ul className="auth_cont">
            {status === "authenticated" ? ( // 세션 상태 확인
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