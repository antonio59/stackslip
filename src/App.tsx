import React, { useState } from 'react';
import { Header } from './components/Header';
import { UsernameInput } from './components/UsernameInput';
import { Receipt } from './components/Receipt';
import { Toaster } from './components/ui/toaster';

function App() {
  const [username, setUsername] = useState('');
  const [showReceipt, setShowReceipt] = useState(false);

  const handleGenerate = () => {
    if (username.trim()) {
      setShowReceipt(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Header />
      <UsernameInput 
        username={username}
        setUsername={setUsername}
        onGenerate={handleGenerate}
      />
      <div className="flex justify-center">
        <Receipt show={showReceipt} username={username} />
      </div>
      <Toaster />
    </div>
  );
}

export default App;