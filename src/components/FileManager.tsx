
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Folder, File, FolderPlus, FilePlus, MoreVertical, Edit3, Trash2, Loader2, Palette, Search } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
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
  const [selectedColor, setSelectedColor] = useState<string>('#3b82f6');
  const [draggedItem, setDraggedItem] = useState<{ id: number; type: 'file' | 'folder'; name: string; color?: string } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const ITEMS_PER_PAGE_DESKTOP = 12;
  const ITEMS_PER_PAGE_MOBILE = 6;
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Load data when component opens
  useEffect(() => {
    if (open) {
      loadFileTree();
      setCurrentPage(1);
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

  // Function to refresh both FileManager and Sidebar after operations
  const refreshData = async () => {
    await loadFileTree();
    // Trigger sidebar refresh if function exists
    if ((window as any).refreshSidebarFileTree) {
      (window as any).refreshSidebarFileTree();
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

  // Filter items based on search query
  const getFilteredItems = (): TreeNode[] => {
    const items = getCurrentItems();
    if (!searchQuery.trim()) {
      return items;
    }
    
    return items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Pagination logic
  const itemsPerPage = isMobile ? ITEMS_PER_PAGE_MOBILE : ITEMS_PER_PAGE_DESKTOP;
  const allItems = getFilteredItems();
  const totalPages = Math.ceil(allItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = allItems.slice(startIndex, endIndex);

  // Reset to first page when changing folders or search
  useEffect(() => {
    setCurrentPage(1);
  }, [currentFolderId, searchQuery]);

  const handleCreateFolder = async () => {
    const result = await folderService.createFolder({
      name: 'Yeni Klasör',
      parent_id: currentFolderId || undefined
    });

    if (result.success && result.data) {
      await refreshData();
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
      await refreshData();
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
        await refreshData();
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
        await refreshData();
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

  const handleColorChange = async (id: number, type: 'file' | 'folder', color: string, name: string) => {
    if (type === 'folder') {
      const result = await folderService.updateFolder(id, { color, name });
      if (result.success) {
        await refreshData();
        toast({
          title: "Başarılı",
          description: "Klasör rengi güncellendi",
        });
      } else {
        toast({
          title: "Hata",
          description: result.message || "Renk güncellenemedi",
          variant: "destructive"
        });
      }
    }
  };

  const handleDelete = async (id: number, type: 'file' | 'folder') => {
    if (type === 'file') {
      const result = await fileService.deleteFile(id);
      if (result.success) {
        await refreshData();
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
        await refreshData();
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

  const handleDragStart = (e: React.DragEvent, item: TreeNode) => {
    setDraggedItem({ 
      id: item.id, 
      type: item.type, 
      name: item.name,
      color: item.color 
    });
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
        const result = await fileService.updateFile(draggedItem.id, { 
          folder_id: targetId,
          name: draggedItem.name,
          color: draggedItem.color 
        });
        if (result.success) {
          await refreshData();
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
        const result = await folderService.updateFolder(draggedItem.id, { 
          parent_id: targetId,
          name: draggedItem.name,
          color: draggedItem.color 
        });
        if (result.success) {
          await refreshData();
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

  const handleItemClick = (item: TreeNode) => {
    if (isRenaming === item.id) return; // Prevent navigation when renaming
    
    if (item.type === 'folder') {
      handleFolderNavigate(item.id, item.name);
    }
  };

  const handleRenameClick = (e: React.MouseEvent, itemId: number, itemName: string) => {
    e.stopPropagation(); // Prevent folder navigation
    setIsRenaming(itemId);
    setNewName(itemName);
  };

  // Skeleton Loading Component
  const FileManagerSkeleton = () => (
    <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'}`}>
      {Array.from({ length: itemsPerPage }).map((_, index) => (
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
          <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {/* Buttons Row */}
            <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'flex-wrap'}`}>
              <Button size="sm" onClick={handleCreateFolder} className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                <FolderPlus size={16} />
                Klasör Oluştur
              </Button>
              <Button size="sm" variant="outline" onClick={handleCreateFile} className="flex items-center gap-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                <FilePlus size={16} />
                Dosya Oluştur
              </Button>
            </div>
            
            {/* Search Row */}
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
              <Input
                type="text"
                placeholder="Dosya veya klasör ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
              />
            </div>
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
          <div className="flex-1 p-4 bg-white dark:bg-gray-900 overflow-hidden">
            {isLoading ? (
              <FileManagerSkeleton />
            ) : (
              <>
                <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6'}`}>
                  {currentItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const folderColorClass = item.type === 'folder' 
                      ? (hasChildren ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500')
                      : 'text-gray-500 dark:text-gray-400';

                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => handleDragOver(e, item.id, item.type)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item.id, item.type)}
                        className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-all bg-white dark:bg-gray-900 ${
                          draggedItem?.id === item.id ? 'opacity-50 scale-95' : ''
                        } ${
                          dragOverItem === item.id && item.type === 'folder' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                        }`}
                        onClick={() => handleItemClick(item)}
                      >
                        <div className="flex-shrink-0">
                          {item.type === 'folder' ? (
                            <Folder 
                              size={32} 
                              className={item.color ? '' : folderColorClass}
                              color={item.color || undefined}
                            />
                          ) : (
                            <File 
                              size={32} 
                              className="text-gray-500 dark:text-gray-400"
                            />
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
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
                              className="h-6 text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <span 
                              className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate block"
                              title={item.name}
                            >
                              {item.name}
                            </span>
                          )}
                        </div>
                        
                        <div className="flex-shrink-0">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical size={12} />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg z-50">
                              <DropdownMenuItem
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRenameClick(e, item.id, item.name);
                                }}
                                className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                              >
                                <Edit3 size={14} className="mr-2" />
                                Yeniden Adlandır
                              </DropdownMenuItem>

                              {item.type === 'folder' && (
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <DropdownMenuItem 
                                      onSelect={(e) => e.preventDefault()} 
                                      className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                    >
                                      <Palette size={14} className="mr-2" />
                                      Renk Seç
                                    </DropdownMenuItem>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent 
                                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <AlertDialogHeader>
                                      <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Renk Seç</AlertDialogTitle>
                                      <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                        {item.name} için bir renk seçin.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <div className="grid grid-cols-8 gap-2 p-4">
                                      {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#000000'].map((color) => (
                                        <button
                                          key={color}
                                          className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500"
                                          style={{ backgroundColor: color }}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleColorChange(item.id, item.type, color, item.name);
                                          }}
                                        />
                                      ))}
                                    </div>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel 
                                        className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        İptal
                                      </AlertDialogCancel>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              )}
                              
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <DropdownMenuItem 
                                    onSelect={(e) => e.preventDefault()} 
                                    className="text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                  >
                                    <Trash2 size={14} className="mr-2" />
                                    Sil
                                  </DropdownMenuItem>
                                </AlertDialogTrigger>
                                <AlertDialogContent 
                                  className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Silmeyi Onayla</AlertDialogTitle>
                                    <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                                      "{item.name}" öğesini silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel 
                                      className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      İptal
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDelete(item.id, item.type);
                                      }}
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
                    );
                  })}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage > 1) setCurrentPage(currentPage - 1);
                            }}
                            className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                        
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                          <PaginationItem key={page}>
                            <PaginationLink
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(page);
                              }}
                              isActive={currentPage === page}
                            >
                              {page}
                            </PaginationLink>
                          </PaginationItem>
                        ))}
                        
                        <PaginationItem>
                          <PaginationNext 
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                            }}
                            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            )}
            
            {!isLoading && allItems.length === 0 && !searchQuery && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Folder size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Bu klasör boş</p>
                <p className="text-sm mt-1">Yeni dosya veya klasör oluşturabilirsiniz</p>
              </div>
            )}
            
            {!isLoading && allItems.length === 0 && searchQuery && (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                <p>Arama sonucu bulunamadı</p>
                <p className="text-sm mt-1">"{searchQuery}" için sonuç bulunamadı</p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileManager;
