'use client';

import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import '@/styles/pages/auth/login.scss';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  return (
    <>
      <h1>로그인</h1>
      <p>SNS로 간편하게 로그인하고 더 많은 서비스로 즐겨보세요!</p>

      <button className="login_button" onClick={() => signIn('google')}>
        Google로 계속하기
      </button>
    </>
  );
}