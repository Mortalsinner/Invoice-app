import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import supabase, { testSupabaseConnection } from './supabase-config'

function App() {
  const [connectionStatus, setConnectionStatus] = useState('Testing...');

  useEffect(() => {
    async function checkConnection() {
      const result = await testSupabaseConnection();
      setConnectionStatus(result ? 'Connected!' : 'Connection Failed');
    }
    checkConnection();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          Supabase connection status: {connectionStatus}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
