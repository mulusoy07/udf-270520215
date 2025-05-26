
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import EditorSidebar from '@/components/EditorSidebar';
import EditorContent from '@/components/EditorContent';
import DocumentDialog from '@/components/DocumentDialog';
import AuthModal from '@/components/AuthModal';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const EditorPage = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [documentDialogOpen, setDocumentDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // On mobile, collapse sidebar by default
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);
  
  // Check authentication when component mounts
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        setAuthModalOpen(true);
      } else {
        setDocumentDialogOpen(true);
      }
    }
  }, [isAuthenticated, isLoading]);

  const handleDocumentLoad = (content: string) => {
    setDocumentContent(content);
    console.log('Loading document content:', content);
    
    // Find the editor content div and set its innerHTML
    setTimeout(() => {
      const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
      if (editorDiv) {
        editorDiv.innerHTML = content;
        console.log('Document loaded into editor');
      }
    }, 100);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      {/* Blurred background when auth modal is open */}
      <div className={`flex-1 flex overflow-hidden transition-all duration-300 ${!isAuthenticated ? 'blur-sm pointer-events-none' : ''}`}>
        <div className="flex flex-1 w-full overflow-hidden relative">
          {/* Always render sidebar, but with collapsed state */}
          <EditorSidebar 
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
            onDocumentLoad={handleDocumentLoad}
          />
          
          {/* Toggle button - positioned correctly for both states */}
          <Button
            variant="ghost"
            size="sm"
            className="absolute z-20 h-8 w-8 p-0 rounded-full bg-white dark:bg-gray-800 shadow-md border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
            style={{ 
              left: sidebarCollapsed 
                ? '46px'
                : '236px',
              top: '4px',
              transition: 'left 0.3s ease'
            }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            disabled={!isAuthenticated}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </Button>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <EditorContent />
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        open={authModalOpen}
        onOpenChange={setAuthModalOpen}
      />
      
      {/* Document Dialog - only show when authenticated */}
      {isAuthenticated && (
        <DocumentDialog 
          open={documentDialogOpen}
          onOpenChange={setDocumentDialogOpen}
        />
      )}
    </div>
  );
};

export default EditorPage;
