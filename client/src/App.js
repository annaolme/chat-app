import React, { useState } from 'react';
import JoinForm from './components/JoinForm';
import ChatRoom from './components/ChatRoom';

function App() {
    const [user, setUser] = useState(null);

    const handleJoin = (username, room) => {
        setUser({ username, room });
    };

    if (!user) {
        return <JoinForm onJoin={handleJoin} />;
    }

    return <ChatRoom username={user.username} room={user.room} onLeave={() => setUser(null)} />;
}

export default App;
