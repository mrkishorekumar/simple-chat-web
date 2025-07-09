import { useState, useEffect } from 'react';

type ChatMessage = { text: string; sender: string };

export interface ChatItem {
    id: number;
    receiver_wallet_key: string;
    chat: ChatMessage[];
}

const LOCAL_STORAGE_KEY = 'chatList';

export function useSyncedChatList() {
    const [chatList, setChatList] = useState<ChatItem[]>(() => {
        try {
            const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Failed to parse chatList from localStorage', e);
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(chatList));
        } catch (e) {
            console.error('Failed to save chatList to localStorage', e);
        }
    }, [chatList]);

    return [chatList, setChatList] as const;
}
