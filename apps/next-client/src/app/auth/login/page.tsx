'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthForm } from '@/hooks/useAuthForm';
import { useAuthActions } from '@/hooks/useAuthActions';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/constants/urls';
import Link from 'next/link';
import '@/styles/pages/auth/login.scss';

export default function LoginPage() {
  const { status } = useSession();
  const router = useRouter();

  const { email, setEmail, password, setPassword, error, setError } = useAuthForm();

  const { handleLogin, handleGoogleLogin } = useAuthActions({ email, password, setError });

  useEffect(() => {
    if (status === 'authenticated') {
      router.push(ROUTES.HOME);
    }
  }, [status, router]);

  return (
    <>
      <h1>로그인</h1>
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
        <button type="button" className="login_button" onClick={handleLogin}>
          로그인
        </button>
      </form>

      <Link href="/auth/signup">회원가입</Link>

      <button className="social_button" onClick={handleGoogleLogin}>
      <img
          src="https://img.icons8.com/color/200/google-logo.png"
          alt="구글로고 이미지"
        />
        Google로 계속하기
      </button>
    </>
  );
}