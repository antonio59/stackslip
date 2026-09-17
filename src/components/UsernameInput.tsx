import { Input } from './ui/input';
import { Button } from './ui/button';

interface UsernameInputProps {
  username: string;
  setUsername: (username: string) => void;
  onGenerate: () => void;
}

export function UsernameInput({ username, setUsername, onGenerate }: UsernameInputProps) {
  return (
    <div className="max-w-md mx-auto mb-10">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onGenerate();
        }}
        className="flex gap-3"
      >
        <label htmlFor="so-username" className="sr-only">
          Stack Overflow username or user ID
        </label>
        <Input
          id="so-username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="username or user id"
          className="flex-1 h-12"
          maxLength={40}
          autoComplete="off"
          spellCheck={false}
          inputMode="text"
        />
        <Button type="submit" className="h-12 px-6">
          Print it
        </Button>
      </form>

      <p className="mt-3 text-xs text-muted-foreground/70 text-center">
        e.g. 28396257 or antonio-smith — from your profile URL
      </p>
    </div>
  );
}
