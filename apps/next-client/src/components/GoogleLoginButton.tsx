import Image from 'next/image';

export const GoogleLoginButton = () => {
  const handleGoogleLogin = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_LOCAL_BACKEND_URL}/api/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="social_button"
    >
      <Image
        src="https://img.icons8.com/color/200/google-logo.png"
        alt="구글로고 이미지"
        width={24}
        height={24}
      />
      Google로 계속하기
    </button>
  );
};