import { useState } from 'react';

export const useLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    setError,
  };
};