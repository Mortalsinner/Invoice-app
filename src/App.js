import logo from './MISC/logo.svg';
import './MISC/App.css';
import './output.css';
import Nav from './Invoice/Component/Nav';
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
   <Nav/>
  );
}

export default App;
