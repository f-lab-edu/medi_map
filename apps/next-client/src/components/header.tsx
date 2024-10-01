'use client';

import React from 'react';
import { signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header() {
  const { data: session } = useSession();

  return (
    <header id="header">
      <div className="inner">
        <h1>
          <Link href="/">MediMap+</Link>
        </h1>
        <div className="right_cont">
          <ul className="menu_cont">
            <li><Link href="/pharmacy">약국찾기</Link></li>
            <li><Link href="/search">약찾기</Link></li>
            <li><Link href="/community">커뮤니티</Link></li>
          </ul>
          <ul className="auth_cont">
            {session ? (
              <>
                <li>
                  <button className="logout-button" onClick={() => signOut()}>
                    로그아웃
                  </button>
                </li>
                <li><Link href="/mypage">마이페이지</Link></li>
              </>
            ) : (
              <>
                <li><Link href="/auth/login">로그인</Link></li>
                <li><Link href="/auth/signup">회원가입</Link></li>
              </>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}
