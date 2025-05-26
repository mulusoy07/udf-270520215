
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Folder, FileSignature, User, Download, FolderOpen, LayoutTemplate } from 'lucide-react';
import SidebarSection from './SidebarSection';
import RecentDocumentItem from './RecentDocumentItem';
import FileTreeItem from './FileTreeItem';
import EditorSidebarHeader from './EditorSidebarHeader';

interface EditorSidebarContentProps {
  historyOpen: boolean;
  setHistoryOpen: (open: boolean) => void;
  filesOpen: boolean;
  setFilesOpen: (open: boolean) => void;
  signatureOpen: boolean;
  setSignatureOpen: (open: boolean) => void;
  accountOpen: boolean;
  setAccountOpen: (open: boolean) => void;
  expandedFolders: string[];
  onToggleFolder: (folderName: string) => void;
  onDocumentClick: (fileName: string) => void;
  onFileClick: (fileName: string) => void;
  onFileAction: (action: string, fileName: string) => void;
  setMobileSignatureOpen: (open: boolean) => void;
  setESignatureOpen: (open: boolean) => void;
  setTemplateGalleryOpen: (open: boolean) => void;
  setFileManagerOpen: (open: boolean) => void;
  setLoginModalOpen: (open: boolean) => void;
  recentDocs: Array<{ name: string; date: string; icon: any }>;
  fileTree: any[];
}

const EditorSidebarContent: React.FC<EditorSidebarContentProps> = ({
  historyOpen,
  setHistoryOpen,
  filesOpen,
  setFilesOpen,
  signatureOpen,
  setSignatureOpen,
  accountOpen,
  setAccountOpen,
  expandedFolders,
  onToggleFolder,
  onDocumentClick,
  onFileClick,
  onFileAction,
  setMobileSignatureOpen,
  setESignatureOpen,
  setTemplateGalleryOpen,
  setFileManagerOpen,
  setLoginModalOpen,
  recentDocs,
  fileTree
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64">
      <ScrollArea className="h-full">
        <div className="p-3 space-y-2 h-full flex flex-col">
          <EditorSidebarHeader collapsed={false} />
          
          <div className="flex-1 space-y-2">
            {/* İşlem Geçmişi */}
            <SidebarSection
              title="İşlem Geçmişi"
              icon={History}
              open={historyOpen}
              onOpenChange={setHistoryOpen}
            >
              {recentDocs.map((doc, index) => (
                <RecentDocumentItem
                  key={index}
                  name={doc.name}
                  date={doc.date}
                  onClick={() => onDocumentClick(doc.name)}
                />
              ))}
            </SidebarSection>

            {/* Dosyalarım */}
            <SidebarSection
              title="Dosyalarım"
              icon={Folder}
              open={filesOpen}
              onOpenChange={setFilesOpen}
            >
              <div className="space-y-2 mb-3 border-b border-gray-100 dark:border-gray-600 pb-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-8 px-3 border-blue-200 dark:border-blue-600 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 bg-white dark:bg-gray-800" 
                  onClick={() => setFileManagerOpen(true)}
                >
                  <FolderOpen size={16} className="mr-2" />
                  <span>Dosya Yöneticisi</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-8 px-3 border-green-200 dark:border-green-600 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/30 bg-white dark:bg-gray-800" 
                  onClick={() => setTemplateGalleryOpen(true)}
                >
                  <LayoutTemplate size={16} className="mr-2" />
                  <span>Hazır Şablonlar</span>
                </Button>
              </div>
              
              <div className="space-y-1">
                {fileTree.map((item) => (
                  <FileTreeItem
                    key={item.name}
                    item={item}
                    expandedFolders={expandedFolders}
                    onToggleFolder={onToggleFolder}
                    onFileClick={onFileClick}
                    onFileAction={onFileAction}
                  />
                ))}
              </div>
            </SidebarSection>

            {/* İmza İşlemleri */}
            <SidebarSection
              title="İmza İşlemleri"
              icon={FileSignature}
              open={signatureOpen}
              onOpenChange={setSignatureOpen}
            >
              <div className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" 
                  size="sm"
                  onClick={() => setMobileSignatureOpen(true)}
                >
                  <FileSignature size={16} className="mr-2" />
                  Mobil İmza ile İmzala
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" 
                  size="sm"
                  onClick={() => setESignatureOpen(true)}
                >
                  <FileSignature size={16} className="mr-2" />
                  E-İmza ile İmzala
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-sm h-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700" 
                  size="sm"
                >
                  <Download size={16} className="mr-2" />
                  Bağlantı Programını İndir
                </Button>
              </div>
            </SidebarSection>

            {/* Hesabım */}
            <SidebarSection
              title="Hesabım"
              icon={User}
              open={accountOpen}
              onOpenChange={setAccountOpen}
            >
              <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={() => setLoginModalOpen(true)}>
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Giriş Yap / Kayıt Ol</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Hesabınıza giriş yapın</div>
              </div>
              <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Profil Bilgileri</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Kullanıcı bilgilerini düzenle</div>
              </div>
              <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Güvenlik Ayarları</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Şifre ve güvenlik seçenekleri</div>
              </div>
              <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Abonelik Bilgileri</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Plan ve ödeme bilgileri</div>
              </div>
              <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Çıkış Yap</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">Hesaptan güvenli çıkış</div>
              </div>
            </SidebarSection>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditorSidebarContent;
