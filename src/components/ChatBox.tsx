import React, { useRef } from 'react';

type ChatMessage = {
  text: string;
  sender: string;
};

interface ChatBoxProps {
  chat: ChatMessage[];
  onSend: (msg: string) => void;
  currentUser: string;
  onBack?: () => void;
}

export default function ChatBox({ chat, onSend, currentUser, onBack }: ChatBoxProps) {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onSend(input.trim());
      setInput('');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '60vh', maxHeight: 400, minWidth: 320 }}>
      {/* Back Button */}
      {onBack && (
        <button
          onClick={onBack}
          style={{
            alignSelf: 'flex-start',
            marginBottom: 8,
            background: 'none',
            border: 'none',
            color: '#6366f1',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <span style={{ fontSize: 20, lineHeight: 1 }}>&larr;</span> Back
        </button>
      )}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', background: '#f7f7fa', borderRadius: 8, marginBottom: 8 }}>
        {chat.length === 0 && <p style={{ color: '#aaa', textAlign: 'center' }}>No messages yet.</p>}
        {chat.map((msg, idx) => (
          <div
            key={idx}
            style={{
              display: 'flex',
              justifyContent: msg.sender === currentUser ? 'flex-end' : 'flex-start',
              marginBottom: 8,
            }}
          >
            <div
              style={{
                background: msg.sender === currentUser ? '#6366f1' : '#ececec',
                color: msg.sender === currentUser ? '#fff' : '#222',
                borderRadius: 16,
                padding: '0.5rem 1rem',
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={{ display: 'flex', gap: 8 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type a message..."
          style={{ flex: 1, padding: '0.5rem', borderRadius: 6, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '0.5rem 1rem', borderRadius: 6, background: '#6366f1', color: '#fff', fontWeight: 600, border: 'none', fontSize: 16, cursor: 'pointer' }}>
          Send
        </button>
      </form>
    </div>
  );
}
