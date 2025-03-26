'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ROUTES, API_URLS } from '@/constants/urls';
import { axiosInstance } from '@/services/axiosInstance';
import Image from 'next/image';
import { useAuth } from '@/hooks/useAuth';

export default function Header() {
  const [menuActive, setMenuActive] = useState(false);
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (user?.id) {
        await axiosInstance.post(API_URLS.LOGOUT, {
          userId: user.id,
        });
      }
      logout();
    } catch (error) {
      console.error('Failed to logout:', error);
      logout();
    }
  };

  const toggleMenu = () => {
    setMenuActive((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuActive(false);
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
            <li><Link href="/search" onClick={closeMenu}>약 정보 검색</Link></li>
            <li><Link href="/pharmacy" onClick={closeMenu}>약국 찾아보기</Link></li>
            <li><Link href="/community" onClick={closeMenu}>건강 이야기</Link></li>
          </ul>
          <ul className="auth_cont">
            {user ? (
              <>
                <li>
                  <button onClick={() => { handleLogout(); closeMenu(); }}>로그아웃</button>
                </li>
                <li><Link href="/mypage" onClick={closeMenu}>마이페이지</Link></li>
              </>
            ) : (
              <>
                <li className='login_button'><Link href="/auth/login" onClick={closeMenu}>로그인</Link></li>
                <li className='sign_up_button'><Link href="/auth/signup" onClick={closeMenu}>회원가입</Link></li>
              </>
            )}
          </ul>
        </div>
        <div className={`menu_list mo_ver ${menuActive ? 'active' : ''}`}>
          <div className="menu_list_all">
            <ul className="menu_cont">
              <li><Link href="/search" onClick={closeMenu}>약 정보 검색</Link></li>
              <li><Link href="/pharmacy" onClick={closeMenu}>약국 찾아보기</Link></li>
              <li><Link href="/community" onClick={closeMenu}>건강 이야기</Link></li>
            </ul>
            <ul className="auth_cont">
              {user ? (
                <>
                  <li>
                    <button onClick={() => { handleLogout(); closeMenu(); }}>로그아웃</button>
                  </li>
                  <li><Link href="/mypage" onClick={closeMenu}>마이페이지</Link></li>
                </>
              ) : (
                <>
                  <li className='login_button'><Link href="/auth/login" onClick={closeMenu}>로그인</Link></li>
                  <li className='sign_up_button'><Link href="/auth/signup" onClick={closeMenu}>회원가입</Link></li>
                </>
              )}
            </ul>
          </div>
          <Image src="/images/icon_close_menu.png" onClick={closeMenu} className='close_button' alt="close_button" width={20} height={20} />
        </div>
        <div
          className={`menu_button mo_ver${menuActive ? 'active' : ''}`}
          onClick={toggleMenu}
        >
          <Image src="/images/icon_menu.png" className='icon_menu' alt="icon_menu" width={30} height={30} />
        </div>
      </div>
    </header>
  );
}