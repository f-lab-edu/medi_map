'use client';

import './page.css';
import useStore from '@/store/useStore';
import { useEffect } from 'react';

export default function Home() {
  const { pokemon, fetchPokemon } = useStore();

  useEffect(() => {
    fetchPokemon();
  }, [fetchPokemon]);

  return (
    <div>
      <h1 className="title">홈페이지</h1>
      <p>테스트 입니다.</p>
      <ul>
        {pokemon.map((name, index) => (
          <li key={index}>{name}</li>
        ))}
      </ul>
    </div>
  );
}