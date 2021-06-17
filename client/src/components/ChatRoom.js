import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

const ENDPOINT = 'http://localhost:4000';

function ChatRoom({ username, room, onLeave }) {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [typing, setTyping] = useState('');
    const socketRef = useRef();
    const messagesEnd = useRef();
    const typingTimeout = useRef();

    useEffect(() => {
        socketRef.current = io(ENDPOINT);
        socketRef.current.emit('join', { username, room });

        socketRef.current.on('message', (msg) => {
            setMessages(prev => [...prev, msg]);
        });

        socketRef.current.on('roomUsers', (data) => {
            setUsers(data.users);
        });

        socketRef.current.on('typing', (data) => {
            setTyping(data.username + ' is typing...');
            clearTimeout(typingTimeout.current);
            typingTimeout.current = setTimeout(() => setTyping(''), 2000);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [username, room]);

    useEffect(() => {
        messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = (e) => {
        e.preventDefault();
        if (input.trim()) {
            socketRef.current.emit('chatMessage', input.trim());
            setInput('');
        }
    };

    const handleTyping = () => {
        socketRef.current.emit('typing');
    };

    return (
        <div className="chat-container">
            <div className="sidebar">
                <h2>Room: {room}</h2>
                <div className="user-list">
                    <h2>Online ({users.length})</h2>
                    {users.map((u, i) => (
                        <div key={i} className="user-item">
                            {u.username === username ? '● ' + u.username + ' (you)' : '○ ' + u.username}
                        </div>
                    ))}
                </div>
                <button className="leave-btn" onClick={onLeave}>Leave Room</button>
            </div>
            <div className="chat-main">
                <div className="chat-header"># {room}</div>
                <div className="messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={
                            'message' +
                            (msg.username === username ? ' own' : '') +
                            (msg.username === 'System' ? ' system' : '')
                        }>
                            {msg.username !== 'System' && msg.username !== username && (
                                <div className="sender">{msg.username}</div>
                            )}
                            <div className="text">{msg.text}</div>
                        </div>
                    ))}
                    <div ref={messagesEnd} />
                </div>
                <div className="typing-indicator">{typing}</div>
                <form className="chat-input" onSubmit={sendMessage}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleTyping}
                        placeholder="Type a message..."
                    />
                    <button type="submit">Send</button>
                </form>
            </div>
        </div>
    );
}

export default ChatRoom;
