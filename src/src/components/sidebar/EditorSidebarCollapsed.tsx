
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Folder, FileSignature, User } from 'lucide-react';
import EditorSidebarHeader from './EditorSidebarHeader';

interface EditorSidebarCollapsedProps {
  expandSidebar: (section: string) => void;
}

const EditorSidebarCollapsed: React.FC<EditorSidebarCollapsedProps> = ({ expandSidebar }) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-16">
      <ScrollArea className="h-full">
        <div className="p-2 flex flex-col items-center space-y-3 h-full">
          <EditorSidebarHeader collapsed={true} />
          
          <div className="flex flex-col space-y-3">
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" 
              title="İşlem Geçmişi" 
              onClick={() => expandSidebar('history')}
            >
              <History size={20} className="text-gray-500 dark:text-gray-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" 
              title="Dosyalarım" 
              onClick={() => expandSidebar('files')}
            >
              <Folder size={20} className="text-gray-500 dark:text-gray-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" 
              title="İmza İşlemleri" 
              onClick={() => expandSidebar('signature')}
            >
              <FileSignature size={20} className="text-gray-500 dark:text-gray-400" />
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="w-12 h-12 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200" 
              title="Hesabım" 
              onClick={() => expandSidebar('account')}
            >
              <User size={20} className="text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditorSidebarCollapsed;
