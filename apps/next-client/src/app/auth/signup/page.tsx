'use client';

import Link from 'next/link';
import Image from 'next/image';
import '@/styles/pages/auth/signup.scss';
import { useSignupForm } from '@/hooks/useSignupForm';
import { useSignupActions } from '@/hooks/useSignupActions';
import { CustomButton } from "@/components/common/CustomButton";
import { useLoginActions } from '@/hooks/useLoginActions';
import { CustomInput } from "@/components/common/CustomInput";

export default function SignupPage() {
  const { username, setUsername, email, setEmail, password, setPassword, error, setError } = useSignupForm();
  const { handleGoogleLogin } = useLoginActions({ email, password, setError });

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
          <CustomInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="이름을 입력해주세요."
            variant="border"
          />
        </fieldset>
        <fieldset>
          <legend>이메일</legend>
          <CustomInput
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일을 입력해주세요."
            variant="border"
          />
        </fieldset>
        <fieldset>
          <legend>비밀번호</legend>
          <CustomInput
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요."
            variant="border"
          />
        </fieldset>
        <CustomButton variant="background"  onClick={handleSignup}>
          회원가입
        </CustomButton>
      </form>
      <Link href="/auth/login" className='login_button'>
        이미 계정이 있으신가요? <span>로그인하기</span>
      </Link>

      <CustomButton variant="border" className='google_button' onClick={handleGoogleLogin}>
        <Image
          src="https://img.icons8.com/color/200/google-logo.png"
          alt="구글로고 이미지"
          width={24}
          height={24}
        />
        Google로 계속하기
      </CustomButton>
    </>
  );
}