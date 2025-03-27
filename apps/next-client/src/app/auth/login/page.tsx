'use client';

import { useState } from 'react';
import { useLoginForm } from '@/hooks/useLoginForm';
import { useLoginActions } from '@/hooks/useLoginActions';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/pages/auth/login.scss';

export default function LoginPage() {
  const { email, setEmail, password, setPassword, error, setError } = useLoginForm();
  const { handleLogin, handleGoogleLogin } = useLoginActions({ email, password, setError });
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGoogleLoggingIn, setIsGoogleLoggingIn] = useState(false);

  const onLoginClick = async () => {
    setIsLoggingIn(true);
    await handleLogin();
    setIsLoggingIn(false);
  };

  const onGoogleLoginClick = async () => {
    setIsGoogleLoggingIn(true);
    await handleGoogleLogin();
    setIsGoogleLoggingIn(false);
  };

  return (
    <>
      <h2>로그인</h2>
      <p>SNS로 간편하게 로그인하고 더 많은 서비스로 즐겨보세요!</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>이메일</legend>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
          />
        </fieldset>
        <fieldset>
          <legend>비밀번호</legend>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
          />
        </fieldset>
        <button
          type="button"
          className="login_button"
          onClick={onLoginClick}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "로그인 중..." : "로그인"}
        </button>
      </form>

      <Link href="/auth/signup">회원가입</Link>

      <button
        className="social_button"
        onClick={onGoogleLoginClick}
        disabled={isGoogleLoggingIn}
      >
        <Image
          src="https://img.icons8.com/color/200/google-logo.png"
          alt="구글로고 이미지"
          width={24}
          height={24}
        />
        {isGoogleLoggingIn ? "Google 로그인 중..." : "Google로 계속하기"}
      </button>
    </>
  );
}