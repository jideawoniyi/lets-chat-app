// App.js
import React, { useState } from 'react';
import Chat from './Chat';
import Login from './Login';

const App = () => {
  const [usernames, setUsernames] = useState({ sender: '', receiver: '' });
  const [loggedIn, setLoggedIn] = useState({ sender: false, receiver: false });

  const handleLogin = (username, userType) => {
    setUsernames((prev) => ({ ...prev, [userType]: username }));
    setLoggedIn((prev) => ({ ...prev, [userType]: true }));
  };

  const appStyle = {
    backgroundColor: '#121212',
    color: '#fff',
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '10px',
  };

  const chatWindowStyle = {
    width: 'calc(50% - 10px)',
    maxWidth: '600px',
    margin: '5px',
  };

  return (
    <div style={appStyle}>
      <div style={chatWindowStyle}>
        {!loggedIn.sender ? (
          <Login onLogin={(username) => handleLogin(username, 'sender')} userType="Sender" />
        ) : (
          <>
            {/* <h2 style={{ textAlign: 'left' }}>{`Sender: ${usernames.sender}`}</h2> */}
            <Chat username={usernames.sender} userType="Sender" />
          </>
        )}
      </div>
      <div style={chatWindowStyle}>
        {!loggedIn.receiver ? (
          <Login onLogin={(username) => handleLogin(username, 'receiver')} userType="Receiver" />
        ) : (
          <>
            {/* <h2 style={{ textAlign: 'left' }}>{`Receiver: ${usernames.receiver}`}</h2> */}
            <Chat username={usernames.receiver} userType="Receiver" />
          </>
        )}
      </div>
    </div>
  );
};

export default App;