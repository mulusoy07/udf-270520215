import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Folder, File, FolderPlus, FilePlus, MoreVertical, Edit3, Trash2, Loader2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { fileService, folderService, TreeNode } from '@/services/fileService';

interface FileManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ open, onOpenChange }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Kök Dizin']);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [isRenaming, setIsRenaming] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [draggedItem, setDraggedItem] = useState<{ id: number; type: 'file' | 'folder' } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Load data when component opens
  useEffect(() => {
    if (open) {
      loadFileTree();
    }
  }, [open]);

  const loadFileTree = async () => {
    setIsLoading(true);
    try {
      const result = await fileService.getFileTree();
      if (result.success && result.data) {
        setFileTree(result.data);
      } else {
        toast({
          title: "Hata",
          description: result.message || "Dosya yapısı yüklenemedi",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error loading file tree:', error);
      toast({
        title: "Hata",
        description: "Dosya yapısı yüklenirken hata oluştu",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentItems = (): TreeNode[] => {
    if (currentFolderId === null) {
      return fileTree;
    }
    
    // Find current folder in the tree
    const findFolder = (nodes: TreeNode[]): TreeNode | null => {
      for (const node of nodes) {
        if (node.id === currentFolderId && node.type === 'folder') {
          return node;
        }
        if (node.children) {
          const found = findFolder(node.children);
          if (found) return found;
        }
      }
      return null;
    };
    
    const currentFolder = findFolder(fileTree);
    return currentFolder?.children || [];
  };

  const handleCreateFolder = async () => {
    const result = await folderService.createFolder({
      name: 'Yeni Klasör',
      parent_id: currentFolderId || undefined
    });

    if (result.success && result.data) {
      // Reload tree to get updated data
      await loadFileTree();
      setIsRenaming(result.data.id);
      setNewName('Yeni Klasör');
      toast({
        title: "Başarılı",
        description: "Klasör oluşturuldu",
      });
    } else {
      toast({
        title: "Hata",
        description: result.message || "Klasör oluşturulamadı",
        variant: "destructive"
      });
    }
  };

  const handleCreateFile = async () => {
    const result = await fileService.createFile({
      name: 'Yeni Belge.udf',
      folder_id: currentFolderId || undefined,
      type: 'udf',
      content: ''
    });

    if (result.success && result.data) {
      // Reload tree to get updated data
      await loadFileTree();
      setIsRenaming(result.data.id);
      setNewName('Yeni Belge.udf');
      toast({
        title: "Başarılı",
        description: "Dosya oluşturuldu",
      });
    } else {
      toast({
        title: "Hata",
        description: result.message || "Dosya oluşturulamadı",
        variant: "destructive"
      });
    }
  };

  const handleRename = async (id: number, type: 'file' | 'folder') => {
    if (type === 'file') {
      const result = await fileService.updateFile(id, { name: newName });
      if (result.success) {
        await loadFileTree(); // Reload tree to get updated data
        toast({
          title: "Başarılı",
          description: "Dosya yeniden adlandırıldı",
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || "Dosya adlandırılamadı",
          variant: "destructive"
        });
      }
    } else {
      const result = await folderService.updateFolder(id, { name: newName });
      if (result.success) {
        await loadFileTree(); // Reload tree to get updated data
        toast({
          title: "Başarılı",
          description: "Klasör yeniden adlandırıldı",
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || "Klasör adlandırılamadı",
          variant: "destructive"
        });
      }
    }
    
    setIsRenaming(null);
    setNewName('');
  };

  const handleDelete = async (id: number, type: 'file' | 'folder') => {
    if (type === 'file') {
      const result = await fileService.deleteFile(id);
      if (result.success) {
        await loadFileTree(); // Reload tree to get updated data
        toast({
          title: "Başarılı",
          description: "Dosya silindi",
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || "Dosya silinemedi",
          variant: "destructive"
        });
      }
    } else {
      const result = await folderService.deleteFolder(id);
      if (result.success) {
        await loadFileTree(); // Reload tree to get updated data
        toast({
          title: "Başarılı",
          description: "Klasör silindi",
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || "Klasör silinemedi",
          variant: "destructive"
        });
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, itemId: number, itemType: 'file' | 'folder') => {
    setDraggedItem({ id: itemId, type: itemType });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e: React.DragEvent, targetId: number, targetType: 'file' | 'folder') => {
    e.preventDefault();
    if (targetType === 'folder' && draggedItem && draggedItem.id !== targetId) {
      e.dataTransfer.dropEffect = 'move';
      setDragOverItem(targetId);
    } else {
      e.dataTransfer.dropEffect = 'none';
    }
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = async (e: React.DragEvent, targetId: number, targetType: 'file' | 'folder') => {
    e.preventDefault();
    setDragOverItem(null);
    
    if (!draggedItem || draggedItem.id === targetId || targetType !== 'folder') {
      setDraggedItem(null);
      return;
    }

    try {
      if (draggedItem.type === 'file') {
        const result = await fileService.updateFile(draggedItem.id, { folder_id: targetId });
        if (result.success) {
          await loadFileTree(); // Reload tree to get updated data
          toast({
            title: "Başarılı",
            description: "Dosya taşındı",
          });
        } else {
          toast({
            title: "Hata",
            description: result.message || "Dosya taşınamadı",
            variant: "destructive"
          });
        }
      } else {
        const result = await folderService.updateFolder(draggedItem.id, { parent_id: targetId });
        if (result.success) {
          await loadFileTree(); // Reload tree to get updated data
          toast({
            title: "Başarılı",
            description: "Klasör taşındı",
          });
        } else {
          toast({
            title: "Hata",
            description: result.message || "Klasör taşınamadı",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error moving item:', error);
      toast({
        title: "Hata",
        description: "Taşıma işlemi başarısız",
        variant: "destructive"
      });
    }
    
    setDraggedItem(null);
  };

  const handleFolderNavigate = (folderId: number, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentPath(prev => [...prev, folderName]);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    
    if (index === 0) {
      setCurrentFolderId(null);
    } else {
      // Find folder by path - simplified for now
      setCurrentFolderId(null);
    }
  };

  const currentItems = getCurrentItems();

  // Skeleton Loading Component
  const FileManagerSkeleton = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
      {Array.from({ length: 12 }).map((_, index) => (
        <div key={index} className="flex flex-col items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-6xl max-h-[90vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">Dosya Yöneticisi</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex flex-wrap gap-2 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            <Button size="sm" onClick={handleCreateFolder} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
              <FolderPlus size={16} />
              Klasör Oluştur
            </Button>
            <Button size="sm" variant="outline" onClick={handleCreateFile} className="flex items-center gap-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
              <FilePlus size={16} />
              Dosya Oluştur
            </Button>
          </div>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 p-4 border-b border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-900">
            {currentPath.map((path, index) => (
              <React.Fragment key={index}>
                <button
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                  onClick={() => handleBreadcrumbClick(index)}
                >
                  {path}
                </button>
                {index < currentPath.length - 1 && <span className="text-gray-400 dark:text-gray-500">/</span>}
              </React.Fragment>
            ))}
          </div>

          {/* File List */}
          <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 bg-white dark:bg-gray-900">
            {isLoading ? (
              <FileManagerSkeleton />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
                  {currentItems.map((item) => (
                    <div
                      key={`${item.type}-${item.id}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, item.id, item.type)}
                      onDragOver={(e) => handleDragOver(e, item.id, item.type)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, item.id, item.type)}
                      className={`flex flex-col items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all bg-white dark:bg-gray-900 ${
                        draggedItem?.id === item.id ? 'opacity-50 scale-95' : ''
                      } ${
                        dragOverItem === item.id && item.type === 'folder' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                      onDoubleClick={() => {
                        if (item.type === 'folder') {
                          handleFolderNavigate(item.id, item.name);
                        }
                      }}
                    >
                      <div className="flex-shrink-0">
                        {item.type === 'folder' ? (
                          <Folder size={32} className="text-blue-500 dark:text-blue-400" />
                        ) : (
                          <File size={32} className="text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      
                      <div className="flex flex-col items-center text-center min-w-0 w-full">
                        {isRenaming === item.id ? (
                          <Input
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            onBlur={() => handleRename(item.id, item.type)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(item.id, item.type);
                              } else if (e.key === 'Escape') {
                                setIsRenaming(null);
                                setNewName('');
                              }
                            }}
                            className="h-6 text-xs text-center bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            autoFocus
                          />
                        ) : (
                          <span className="text-xs font-medium text-center break-words w-full text-gray-900 dark:text-gray-100">{item.name}</span>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 mt-1 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                              <MoreVertical size={12} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                            <DropdownMenuItem
                              onClick={() => {
                                setIsRenaming(item.id);
                                setNewName(item.name);
                              }}
                              className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                            >
                              <Edit3 size={14} className="mr-2" />
                              Yeniden Adlandır
                            </DropdownMenuItem>
                            
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <Trash2 size={14} className="mr-2" />
                                  Sil
                                </DropdownMenuItem>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Silmeyi Onayla</AlertDialogTitle>
                                  <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                    "{item.name}" öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">İptal</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(item.id, item.type)}
                                    className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                  >
                                    Sil
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
            
            {!isLoading && currentItems.length === 0 && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Folder size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Bu klasör boş</p>
                <p className="text-sm mt-1">Yeni dosya veya klasör oluşturabilirsiniz</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileManager;
