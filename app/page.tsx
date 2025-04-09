'use client';

import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');

  const [isRunning, setIsRunning] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [stoppedElapsedMs, setStoppedElapsedMs] = useState(0);
  const [today, setToday] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [memo, setMemo] = useState('');
  const [tags, setTags] = useState('');
  const [records, setRecords] = useState<any[]>([]);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 許可されたユーザー名とパスワード
  const correctUsername = 'admin';
  const correctPassword = 'password123';

  useEffect(() => {
    const stored = localStorage.getItem('records');
    if (stored) {
      setRecords(JSON.parse(stored));
    }
    setToday(new Date().toLocaleDateString());
  }, []);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setElapsedMs(prev => prev + 10);
      }, 10);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning]);

  const pad = (num: number, size: number) => {
    let s = String(num);
    while (s.length < size) s = "0" + s;
    return s;
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);
    const milliseconds = Math.floor((ms % 1000) / 10);
    return `${pad(hours,2)}:${pad(minutes,2)}:${pad(seconds,2)}.${pad(milliseconds,2)}`;
  };

  const saveRecord = () => {
    const newRecord = {
      date: today,
      memo: memo,
      tags: tags.split(',').map(tag => tag.trim()),
      timeMs: stoppedElapsedMs,
    };
    const newRecords = [...records, newRecord];
    setRecords(newRecords);
    localStorage.setItem('records', JSON.stringify(newRecords));
    setIsModalOpen(false);
    setElapsedMs(0);
    setStoppedElapsedMs(0);
    setMemo('');
    setTags('');
  };

  // ログインチェック処理
  const handleLogin = () => {
    if (usernameInput === correctUsername && passwordInput === correctPassword) {
      setIsLoggedIn(true);
    } else {
      alert('ユーザー名またはパスワードが違います');
    }
  };

  // まだログインしてない場合、ログイン画面を表示
  if (!isLoggedIn) {
    return (
      <main className="flex flex-col items-center justify-center min-h-screen p-8">
        <h1 className="text-3xl font-bold mb-6">ログイン</h1>
        <input
          type="text"
          placeholder="ユーザー名"
          value={usernameInput}
          onChange={(e) => setUsernameInput(e.target.value)}
          className="w-80 border border-gray-300 rounded p-2 mb-4"
        />
        <input
          type="password"
          placeholder="パスワード"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
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

  // ログイン後はタイマー画面を表示
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">Live My Life</h1>
      <h2 className="text-2xl mb-2">{today}</h2>

      <div className="text-3xl mb-8">
        {formatTime(elapsedMs)}
      </div>

      <button
        className={`px-6 py-3 rounded-lg text-white text-lg ${
          isRunning ? 'bg-red-500' : 'bg-green-500'
        }`}
        onClick={() => {
          if (isRunning) {
            setIsRunning(false);
            setStoppedElapsedMs(elapsedMs);
            setIsModalOpen(true);
          } else {
            setElapsedMs(0);
            setIsRunning(true);
          }
        }}
      >
        {isRunning ? 'ストップ' : 'スタート'}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-80">
            <h3 className="text-xl font-bold mb-4">作業記録</h3>
            <div className="text-lg mb-2">作業時間: {formatTime(stoppedElapsedMs)}</div>
            <textarea
              placeholder="作業内容を入力..."
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
              rows={3}
            />
            <input
              type="text"
              placeholder="タグ（カンマ区切り）"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mb-4"
            />
            <button
              className="w-full bg-blue-500 text-white py-2 rounded"
              onClick={saveRecord}
            >
              保存する
            </button>
          </div>
        </div>
      )}

      <div className="w-full max-w-2xl mt-12">
        <h2 className="text-2xl font-bold mb-4">記録一覧</h2>
        {records.length === 0 ? (
          <p className="text-gray-500">まだ記録がありません</p>
        ) : (
          <ul className="space-y-4">
            {records.map((record, index) => (
              <li key={index} className="p-4 border rounded-lg shadow">
                <div className="text-sm text-gray-500 mb-1">{record.date}</div>
                <div className="text-lg font-semibold mb-1">{record.memo || '(メモなし)'}</div>
                <div className="text-sm text-gray-700 mb-1">
                  タグ: {record.tags.length > 0 ? record.tags.join(', ') : '(なし)'}
                </div>
                <div className="text-sm text-gray-700">
                  時間: {formatTime(record.timeMs)}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
