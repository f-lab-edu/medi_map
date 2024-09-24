"use client"; 

import './page.css';
import useStore from '@/store/useStore';  

export default function Home() {
  const { message, setMessage } = useStore(); 

  return (
    <div>
      <h1 className='title'>홈페이지</h1>
      <p>테스트 입니다.</p>
      <p>{message}</p>
    </div>
  );
}
