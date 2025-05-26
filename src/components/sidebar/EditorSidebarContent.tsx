
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Folder, FileSignature, User, Download, FolderOpen, LayoutTemplate, Settings, CreditCard, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { treeService, TreeItem } from '@/services/treeService';
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
  recentDocs
}) => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [treeItems, setTreeItems] = useState<TreeItem[]>([]);
  const [isLoadingTree, setIsLoadingTree] = useState(false);

  // Load tree structure when component mounts or user authentication changes
  useEffect(() => {
    if (isAuthenticated) {
      loadTreeStructure();
    }
  }, [isAuthenticated]);

  const loadTreeStructure = async () => {
    setIsLoadingTree(true);
    try {
      const result = await treeService.getTreeStructure();
      if (result.success && result.data) {
        setTreeItems(result.data);
      } else {
        toast({
          title: "Hata",
          description: result.message || "Dosya yapısı yüklenemedi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading tree structure:', error);
      toast({
        title: "Hata",
        description: "Dosya yapısı yüklenirken hata oluştu",
        variant: "destructive"
      });
    } finally {
      setIsLoadingTree(false);
    }
  };

  const buildFileTree = (items: TreeItem[], parentId?: number): any[] => {
    return items
      .filter(item => item.parent_id === parentId)
      .map(item => {
        const children = buildFileTree(items, item.id);
        
        // Get appropriate icon based on type
        let icon;
        switch (item.type) {
          case 'folder':
            icon = Folder;
            break;
          case 'project':
            icon = FolderOpen;
            break;
          case 'contract':
            icon = FileSignature;
            break;
          case 'report':
            icon = History;
            break;
          default:
            icon = Folder;
        }

        return {
          name: item.name,
          type: children.length > 0 ? 'folder' : 'file',
          icon,
          children: children.length > 0 ? children : undefined
        };
      });
  };

  const fileTree = buildFileTree(treeItems);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  const handleSubscriptionsClick = () => {
    navigate('/subscriptions');
  };

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
              
              {isLoadingTree ? (
                <div className="text-center py-4">
                  <div className="text-sm text-gray-500 dark:text-gray-400">Yükleniyor...</div>
                </div>
              ) : (
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
              )}
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
              {isAuthenticated ? (
                <div className="space-y-2">
                  <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={handleProfileClick}>
                    <div className="flex items-center gap-2">
                      <Settings size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Profilim</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Kişisel bilgileri düzenle</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={handleSubscriptionsClick}>
                    <div className="flex items-center gap-2">
                      <CreditCard size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Aboneliklerim</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Plan ve ödeme bilgileri</div>
                      </div>
                    </div>
                  </div>
                  <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={handleLogout}>
                    <div className="flex items-center gap-2">
                      <LogOut size={16} className="text-gray-500 dark:text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Çıkış Yap</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">Hesaptan güvenli çıkış</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer" onClick={() => setLoginModalOpen(true)}>
                  <div className="text-sm font-medium text-gray-900 dark:text-gray-100">Giriş Yap / Kayıt Ol</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">Hesabınıza giriş yapın</div>
                </div>
              )}
            </SidebarSection>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default EditorSidebarContent;
