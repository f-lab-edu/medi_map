'use client';

import Link from 'next/link';
import '@/styles/pages/auth/signup.scss';
import { useSignupForm } from '@/hooks/useSignupForm';
import { useSignupActions } from '@/hooks/useSignupActions';

export default function SignupPage() {
  const { username, setUsername, email, setEmail, password, setPassword, error, setError } = useSignupForm();

  const { handleSignup } = useSignupActions({
    username,
    email,
    password,
    setError,
  });

  return (
    <>
      <h2>회원가입</h2>
      <p>건강한 생활을 위한 첫걸음, 지금 가입하세요.💪</p>

      {error && <p className="error">{error}</p>}

      <form onSubmit={(e) => e.preventDefault()}>
        <fieldset>
          <legend>이름</legend>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름을 입력해주세요."
          />
        </fieldset>
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
        <button type="button" className="signup_button" onClick={handleSignup}>
          회원가입
        </button>
      </form>
      <Link href="/auth/login">
        이미 계정이 있으신가요? <span>로그인하기</span>
      </Link>
    </>
  );
}
