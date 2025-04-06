import React from 'react';
import { HelpCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';

interface UsernameInputProps {
  username: string;
  setUsername: (username: string) => void;
  onGenerate: () => void;
}

export function UsernameInput({ username, setUsername, onGenerate }: UsernameInputProps) {
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onGenerate();
    }
  };

  return (
    <div className="max-w-2xl mx-auto mb-8">
      <div className="flex gap-4">
        <Input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter username or ID (e.g., 28396257, antonio-smith)"
          className="flex-1 text-lg h-12"
        />
        <Button 
          onClick={onGenerate}
          className="h-12 px-8 text-lg"
        >
          Generate
        </Button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600 flex items-start gap-2">
        <HelpCircle size={16} className="mt-0.5 flex-shrink-0" />
        <div>
          <p>You can search by:</p>
          <ol className="list-decimal ml-5 mt-1 space-y-1">
            <li>Username from profile (e.g., "antonio-smith")</li>
            <li>User ID from URL (e.g., "28396257")</li>
          </ol>
        </div>
      </div>
    </div>
  );
}