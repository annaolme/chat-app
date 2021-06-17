import React, { useState } from 'react';

function JoinForm({ onJoin }) {
    const [username, setUsername] = useState('');
    const [room, setRoom] = useState('general');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            onJoin(username.trim(), room);
        }
    };

    return (
        <div className="join-container">
            <form className="join-form" onSubmit={handleSubmit}>
                <h1>Join Chat</h1>
                <input
                    type="text"
                    placeholder="Your name"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <select value={room} onChange={(e) => setRoom(e.target.value)}>
                    <option value="general">General</option>
                    <option value="random">Random</option>
                    <option value="tech">Tech</option>
                </select>
                <button type="submit">Join Room</button>
            </form>
        </div>
    );
}

export default JoinForm;
