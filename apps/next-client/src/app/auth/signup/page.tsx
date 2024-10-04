'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import '@/styles/pages/auth/signup.scss';

export default function SignupPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSignup = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signup', {
        username,
        email,
        password,
      });
      if (response.status === 201) {
        router.push('/auth/login');
      }
    } catch (err) {
      setError(err.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
    }
  };
  

  return (
    <>
      <h1>회원가입</h1>
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

      <Link href="/auth/login">이미 계정이 있으신가요? <span>로그인하기</span></Link>
    </>
  );
}
