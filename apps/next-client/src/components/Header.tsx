'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { ROUTES, API_URLS } from '@/constants/urls';
import Cookies from 'js-cookie';
import axios from 'axios';
import Image from 'next/image';

export default function Header() {
  const { data: session, status } = useSession();
  const [menuActive, setMenuActive] = useState(false); // 메뉴 활성 상태

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

  const toggleMenu = () => {
    setMenuActive((prev) => !prev); // 상태를 토글
  };

  const closeMenu = () => {
    setMenuActive(false); // 상태를 false로 설정
  };

  return (
    <header id="header">
      <div className="inner">
        <h1>
          <Link href="/">MediMap+</Link>
          <Image src="/images/icon-medicine.webp" alt="logo" width={500} height={300} />
        </h1>
        <div className="right_cont pc_ver">
          <ul className="menu_cont">
            <li><Link href="/search">약 정보 검색</Link></li>
            <li><Link href="/pharmacy">약국 찾아보기</Link></li>
            <li><Link href="/community">건강 이야기</Link></li>
          </ul>
          <ul className="auth_cont">
            {status === "authenticated" ? (
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
        <div className={`menu_list mo_ver ${menuActive ? 'active' : ''}`}>
          <div className="menu_list_all">
          <ul className="menu_cont">
            <li><Link href="/search">약 정보 검색</Link></li>
            <li><Link href="/pharmacy">약국 찾아보기</Link></li>
            <li><Link href="/community">건강 이야기</Link></li>
          </ul>
          <ul className="auth_cont">
            {status === "authenticated" ? (
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
          <img
            src="/images/icon_close_menu.png"
            alt=""
            className='close_button'
            onClick={closeMenu}
          />
        </div>
        <div
          className={`menu_button ${menuActive ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <img src="/images/icon_menu.png" alt="" />
        </div>
      </div>
    </header>
  );
}
