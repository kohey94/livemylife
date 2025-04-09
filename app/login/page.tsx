'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
      router.replace('/dashboard');
    } else {
      setAuthChecked(true);
    }
  }, [router]);

  if (!authChecked) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  const correctUsername = 'admin';
  const correctPassword = 'password123';

  const handleLogin = () => {
    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem('isLoggedIn', 'true');
      router.replace('/dashboard');
    } else {
      alert('ユーザー名またはパスワードが違います');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">ログイン</h1>
      <input
        type="text"
        placeholder="ユーザー名"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-80 border border-gray-300 rounded p-2 mb-4"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-80 border border-gray-300 rounded p-2 mb-6"
      />
      <button
        className="w-80 bg-blue-500 text-white py-2 rounded"
        onClick={handleLogin}
      >
        ログイン
      </button>
    </main>
  );
}
