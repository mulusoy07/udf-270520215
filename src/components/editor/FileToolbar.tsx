
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { FileText, Save, Printer, FolderOpen, Moon, Sun } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useDarkMode } from '@/contexts/DarkModeContext';
import { useAuth } from '@/contexts/AuthContext';
import NavbarSignatureButtons from '@/components/navbar/NavbarSignatureButtons';
import MobileSignatureDialog from '@/components/MobileSignatureDialog';
import ESignatureDialog from '@/components/ESignatureDialog';

interface FileToolbarProps {
  onNewDocument: () => void;
  onSaveDocument: () => void;
  onPrintDocument: () => void;
  onOpenDocument: () => void;
}

const FileToolbar: React.FC<FileToolbarProps> = ({
  onNewDocument,
  onSaveDocument,
  onPrintDocument,
  onOpenDocument
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { isAuthenticated } = useAuth();
  const [mobileSignatureOpen, setMobileSignatureOpen] = useState(false);
  const [eSignatureOpen, setESignatureOpen] = useState(false);

  return (
    <>
      <div className="border-b border-gray-200 dark:border-gray-700 p-2 bg-gray-50 dark:bg-gray-800">
        <TooltipProvider>
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-center gap-1">
              {/* İmza butonları */}
              <NavbarSignatureButtons
                onMobileSignatureClick={() => setMobileSignatureOpen(true)}
                onESignatureClick={() => setESignatureOpen(true)}
                isMobile={isMobile}
              />
              
              <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
              
              {/* Dosya işlemleri */}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`}
                    onClick={onNewDocument}
                    disabled={!isAuthenticated}
                  >
                    <FileText size={isMobile ? 14 : 16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Yeni Dosya</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`}
                    onClick={onOpenDocument}
                    disabled={!isAuthenticated}
                  >
                    <FolderOpen size={isMobile ? 14 : 16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Dosya Aç</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`}
                    onClick={onSaveDocument}
                    disabled={!isAuthenticated}
                  >
                    <Save size={isMobile ? 14 : 16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Kaydet</TooltipContent>
              </Tooltip>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`}
                    onClick={onPrintDocument}
                    disabled={!isAuthenticated}
                  >
                    <Printer size={isMobile ? 14 : 16} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Yazdır</TooltipContent>
              </Tooltip>
            </div>
            
            {/* Dark Mode Toggle */}
            <div className="flex items-center gap-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`}
                    onClick={toggleDarkMode}
                  >
                    {isDarkMode ? <Sun size={isMobile ? 14 : 16} /> : <Moon size={isMobile ? 14 : 16} />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isDarkMode ? 'Açık Tema' : 'Koyu Tema'}</TooltipContent>
              </Tooltip>
            </div>
          </div>
        </TooltipProvider>
      </div>
      
      {/* Dialog components */}
      <MobileSignatureDialog open={mobileSignatureOpen} onOpenChange={setMobileSignatureOpen} />
      <ESignatureDialog open={eSignatureOpen} onOpenChange={setESignatureOpen} />
    </>
  );
};

export default FileToolbar;
