
import React, { useState, useEffect } from 'react';
import EditorSidebar from '@/components/EditorSidebar';
import EditorContent from '@/components/EditorContent';
import DocumentDialog from '@/components/DocumentDialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMediaQuery } from '@/hooks/useMediaQuery';

const EditorPage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [documentContent, setDocumentContent] = useState('');
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  // On mobile, collapse sidebar by default
  useEffect(() => {
    setSidebarCollapsed(isMobile);
  }, [isMobile]);
  
  // Show dialog on first render
  useEffect(() => {
    setDialogOpen(true);
  }, []);

  const handleDocumentLoad = (content: string) => {
    setDocumentContent(content);
    console.log('Loading document content:', content);
    
    // Auto-collapse sidebar on mobile when document is loaded
    if (isMobile) {
      setSidebarCollapsed(true);
    }
    
    // Find the editor content div and set its innerHTML
    setTimeout(() => {
      const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
      if (editorDiv) {
        editorDiv.innerHTML = content;
        console.log('Document loaded into editor');
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <div className="flex-1 flex overflow-hidden">
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
                ? (isMobile ? '46px' : '46px') 
                : (isMobile ? '236px' : '236px'),
              top: '4px',
              transition: 'left 0.3s ease'
            }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </Button>
          
          <div className="flex flex-col flex-1 overflow-hidden">
            <EditorContent />
          </div>
        </div>
      </div>
      
      <DocumentDialog 
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
};

export default EditorPage;
