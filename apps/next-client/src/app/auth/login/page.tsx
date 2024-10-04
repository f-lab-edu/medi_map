'use client';

import { useEffect, useState } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import '@/styles/pages/auth/login.scss';

export default function LoginPage() {
  const { data: status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });
      if (result?.error) {
        setError(result.error);
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('로그인 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google', { callbackUrl: '/' });
  };

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
        <Image
          src="https://img.icons8.com/color/200/google-logo.png"
          alt="구글 이미지"
          width={24}
          height={24}
        />
        Google로 계속하기
      </button>
    </>
  );
}
