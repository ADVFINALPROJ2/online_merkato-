'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function ChatPage() {
  const params = useParams();
  const id = params?.id; // Safely grab the dynamic order [id] from the App Router path

  const [messages, setMessages] = useState<{ id: string; text: string; sender: string }[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (!id) return;

    // Fetch messages from the backend using the current route ID
    const fetchMessages = async () => {
      try {
        const res = await fetch(`http://localhost:3000/chat/messages/${id}`);
        const data = await res.json();
        setMessages(data);
      } catch (err) {
        console.error('Failed to fetch messages', err);
      }
    };

    fetchMessages();
  }, [id]);

  const handleSend = async () => {
    if (!id) return;

    try {
      const res = await fetch(`http://localhost:3000/chat/messages/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage, sender: 'driver' }),
      });

      if (!res.ok) throw new Error('Failed to send message');

      const data = await res.json();
      setMessages([...messages, data]);
      setNewMessage('');
    } catch (err) {
      console.error('Failed to send message', err);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '25px', fontFamily: 'sans-serif', border: '1px solid #eaeaea', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      <h2 style={{ marginBottom: '10px', textAlign: 'center' }}>Chat with Buyer</h2>
      
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ddd', borderRadius: '8px', padding: '15px', backgroundColor: '#f9f9f9' }}>
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: '10px' }}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div style={{ margin: '20px 0' }}>
          <label htmlFor="message" style={{ display: 'block', marginBottom: '5px' }}>Message:</label>
          <input type="text" id="message" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} required />
        </div>
        <button onClick={handleSend} style={{ padding: '8px 14px', backgroundColor: '#22c55e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
          Send
        </button>
      </form>
    </div>
  );
}