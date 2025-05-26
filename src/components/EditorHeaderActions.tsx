
import React from 'react';
import { Button } from '@/components/ui/button';
import { Moon, Sun, User } from 'lucide-react';
import { useDarkMode } from '@/contexts/DarkModeContext';
import LoginModal from '@/components/LoginModal';
import { useState } from 'react';

const EditorHeaderActions: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [loginModalOpen, setLoginModalOpen] = useState(false);

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleDarkMode}
        className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        title={isDarkMode ? "Açık tema" : "Koyu tema"}
      >
        {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
      </Button>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setLoginModalOpen(true)}
        className="h-8 w-8 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
        title="Giriş Yap"
      >
        <User size={16} />
      </Button>
      
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </div>
  );
};

export default EditorHeaderActions;
