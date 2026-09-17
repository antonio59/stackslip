import { useState } from 'react';
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
    <div className="min-h-screen p-6 sm:p-10">
      <Header />
      <main>
        <UsernameInput
          username={username}
          setUsername={setUsername}
          onGenerate={handleGenerate}
        />
        <div className="flex justify-center">
          <Receipt show={showReceipt} username={username} />
        </div>
      </main>
      <Toaster />
    </div>
  );
}

export default App;