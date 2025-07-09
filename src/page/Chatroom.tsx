import axios from 'axios';
import React, { useState, useEffect } from 'react';
import ChatBox from '../components/ChatBox';
import { socket } from '../socket';
import { useSyncedChatList } from '../hook/useSyncedChatList';


export default function Chatroom() {
    const [newChatAddress, setNewChatAddress] = useState('');
    const [chatList, setChatList] = useSyncedChatList();
    const [chatopen, setChatOpen] = useState<{ receiver_wallet_key: string }>({ receiver_wallet_key: '' });

    const handleCreateChat = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await axios.get(`https://testapi.ghostx.chat/api/users/${newChatAddress}/exists`) as { data: { status: boolean, message: string } };
        if (!res.data.status) {
            alert(res.data.message);
            return;
        }
        setChatList((prev) => {
            const newChat = {
                id: prev.length + 1,
                receiver_wallet_key: newChatAddress,
                chat: [],
            };
            return [...prev, newChat];
        });
        setNewChatAddress('');
    };

    // Add send message handler for chat
    const handleSendMessage = (msg: string) => {
        const sender = localStorage.getItem('walletAddress');
        const receiver = chatopen.receiver_wallet_key;

        if (!sender || !receiver) return;

        const sent_at = new Date().toISOString();

        // Send message via socket
        socket.emit('send_message', {
            sender,
            receiver,
            message: msg,
            sent_at,
        });

        // Optimistic UI update
        setChatList(prev =>
            prev.map(chat =>
                chat.receiver_wallet_key === receiver
                    ? { ...chat, chat: [...chat.chat, { text: msg, sender: 'me' }] }
                    : chat
            )
        );
    };

    const walletKey = localStorage.getItem('walletAddress');

    useEffect(() => {
        if (!walletKey) return;

        const identify = () => {
            console.log('Identifying with wallet:', walletKey);
            socket.emit('identify', walletKey);
        };

        if (socket.connected) {
            identify();
        } else {
            socket.on('connect', identify);
        }

        socket.on('receive_message', (data: { sender: string; message: string; chatId: string }) => {
            const { sender, message, chatId } = data;

            setChatList(prev => {
                const chatExists = prev.find(c => c.receiver_wallet_key === sender);
                if (chatExists) {
                    return prev.map(chat =>
                        chat.receiver_wallet_key === sender
                            ? { ...chat, chat: [...chat.chat, { text: message, sender }] }
                            : chat
                    );
                } else {
                    return [...prev, { id: prev.length + 1, receiver_wallet_key: sender, chat: [{ text: message, sender }] }];
                }
            });

            socket.emit('acknowledge_message', { chatId });
        });

        return () => {
            socket.off('connect', identify);
            socket.off('receive_message');
        };
    }, [walletKey]);



    const isopen = chatopen?.receiver_wallet_key.length > 0;

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f6fa' }}>
            <div style={{ background: '#fff', padding: '2rem 2.5rem', borderRadius: '12px', boxShadow: '0 2px 16px rgba(0,0,0,0.08)', minWidth: 350, maxWidth: 400, width: '100%' }}>
                {/* Create New Chat Section */}
                {!isopen && <form onSubmit={handleCreateChat} style={{ marginBottom: '2rem', display: 'flex', gap: 8 }}>
                    <input
                        type="text"
                        placeholder="Enter address to chat"
                        value={newChatAddress}
                        onChange={e => setNewChatAddress(e.target.value)}
                        style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
                        required
                    />
                    <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#6366f1', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, cursor: 'pointer' }}>
                        Create
                    </button>
                </form>}
                {!isopen &&
                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(localStorage.getItem('walletAddress') || '');
                            alert('Your wallet address has been copied to clipboard.')
                        }}
                        style={{
                            alignSelf: 'flex-start',
                            marginBottom: 8,
                            background: 'none',
                            border: 'none',
                            color: "blue", cursor: "pointer"
                        }}>Copy Your Wallet Address</button>
                }
                {/* Chat List Section */}
                <h3 style={{ marginBottom: '1rem', fontWeight: 600 }}>{isopen ? chatopen?.receiver_wallet_key?.slice(0, 30) : "All Chats"}</h3>
                <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                    {
                        chatList.length === 0 ? (
                            <p style={{ color: '#888', textAlign: 'center', margin: '1rem 0' }}>No chats available. Create a new chat to start.</p>
                        ) : isopen ? (
                            <ChatBox
                                chat={chatList.find(c => c.receiver_wallet_key === chatopen.receiver_wallet_key)?.chat || []}
                                onSend={handleSendMessage}
                                currentUser={'me'}
                                onBack={() => setChatOpen({ receiver_wallet_key: '' })}
                            />
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                {chatList.map(chat => (
                                    <li key={chat.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '0.75rem 0', borderBottom: '1px solid #f0f0f0', cursor: 'pointer' }}
                                        onClick={() => setChatOpen({ receiver_wallet_key: chat.receiver_wallet_key })}
                                    >
                                        <img src="https://ui-avatars.com/api/?name=Chat&background=ececec&color=6366f1&rounded=true&size=36" alt="avatar" style={{ width: 36, height: 36, borderRadius: '50%' }} />
                                        <span style={{ fontFamily: 'monospace', fontSize: 15 }}>{chat.receiver_wallet_key}</span>
                                    </li>
                                ))}
                            </ul>
                        )
                    }

                </div>
            </div>
        </div>
    );
}
