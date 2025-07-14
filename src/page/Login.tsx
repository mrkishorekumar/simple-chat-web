import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

export default function Login() {
  const [userWalletKey, setUserWalletKey] = useState('');
  const [fcmToken, setFcmToken] = useState('');
  const navigator = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post('https://testapi.ghostx.chat/api/user/register', {
      walletAddress: userWalletKey,
      fcmToken: fcmToken,
    }) as  {data: { status: boolean, message : string, accessToken: string } };
    if (res.data.status) {
      localStorage.setItem('accessToken', res.data.accessToken);
      localStorage.setItem('walletAddress', userWalletKey);
      setTimeout(() => {
        navigator('/chat');
      }, 500); // Clear after 24 hours
      
    } else {
      toast.error(res.data.message)
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
      <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem 2.5rem', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 320 }}>
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Start New Chat</h2>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="user_wallet_key" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>User Wallet Key</label>
          <input
            id="user_wallet_key"
            type="text"
            value={userWalletKey}
            onChange={e => setUserWalletKey(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <label htmlFor="fcm_token" style={{ display: 'block', marginBottom: 6, fontWeight: 500 }}>FCM Token</label>
          <input
            id="fcm_token"
            type="text"
            value={fcmToken}
            onChange={e => setFcmToken(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '0.75rem', borderRadius: 6, background: '#6366f1', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, cursor: 'pointer' }}>
          Submit
        </button>
      </form>
    </div>
  );
}
