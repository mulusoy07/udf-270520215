
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Folder, File, FolderPlus, FilePlus, Home, Edit3, Trash2, Palette, Search, Check, MoreVertical, Upload, RefreshCw, Grid3X3, List, ChevronDown, X } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { fileService, folderService, TreeNode, addCacheListener, removeCacheListener } from '@/services/fileService';

interface FileManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ open, onOpenChange }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Kök Dizin']);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [isRenaming, setIsRenaming] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [selectedItem, setSelectedItem] = useState<TreeNode | null>(null);
  const [draggedItem, setDraggedItem] = useState<{ id: number; type: 'file' | 'folder'; name: string; color?: string } | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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

  // Cache listener ekleme
  useEffect(() => {
    const listener = (newTree: TreeNode[]) => {
      setFileTree(newTree);
    };
    
    addCacheListener(listener);
    return () => removeCacheListener(listener);
  }, []);

  // Load data when component opens
  useEffect(() => {
    if (open) {
      loadFileTree();
      setSelectedItem(null);
    }
  }, [open]);

  const loadFileTree = async () => {
    setIsLoading(true);
    try {
      const result = await fileService.getFileTree(fileTree.length > 0);
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

  const getFilteredAndSortedItems = (): TreeNode[] => {
    let items = getCurrentItems();
    
    // Filter by search query
    if (searchQuery.trim()) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Sort items
    items.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'date':
          // Assuming items have created_at or updated_at
          comparison = new Date(a.updated_at || a.created_at || '').getTime() - 
                      new Date(b.updated_at || b.created_at || '').getTime();
          break;
        case 'size':
          // For demonstration, using name length as size
          comparison = (a.size || 0) - (b.size || 0);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return items;
  };

  const handleCreateFolder = async () => {
    const result = await folderService.createFolder({
      name: 'Yeni Klasör',
      parent_id: currentFolderId || undefined
    });

    if (result.success && result.data) {
      setIsRenaming(result.data.id);
      setNewName('Yeni Klasör');
      setOriginalName('Yeni Klasör');
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
      setIsRenaming(result.data.id);
      setNewName('Yeni Belge.udf');
      setOriginalName('Yeni Belge.udf');
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
    // Validate: check if name actually changed and is not empty
    if (!newName.trim() || newName === originalName) {
      setIsRenaming(null);
      setNewName('');
      setOriginalName('');
      return;
    }

    if (type === 'file') {
      const result = await fileService.updateFile(id, { name: newName });
      if (result.success) {
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
    setOriginalName('');
  };

  const handleColorChange = async (id: number, type: 'file' | 'folder', color: string, name: string) => {
    if (type === 'folder') {
      const result = await folderService.updateFolder(id, { color, name });
      if (result.success) {
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
    setIsColorPaletteOpen(false);
    setIsActionsOpen(false);
  };

  const handleDelete = async (id: number, type: 'file' | 'folder') => {
    if (type === 'file') {
      const result = await fileService.deleteFile(id);
      if (result.success) {
        toast({
          title: "Başarılı",
          description: "Dosya silindi",
        });
        setSelectedItem(null);
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
        toast({
          title: "Başarılı",
          description: "Klasör silindi",
        });
        setSelectedItem(null);
      } else {
        toast({
          title: "Hata",
          description: result.message || "Klasör silinemedi",
          variant: "destructive"
        });
      }
    }
    setIsActionsOpen(false);
  };

  const handleFolderNavigate = (folderId: number, folderName: string) => {
    setCurrentFolderId(folderId);
    setCurrentPath(prev => [...prev, folderName]);
    setSelectedItem(null);
  };

  const handleBreadcrumbClick = (index: number) => {
    const newPath = currentPath.slice(0, index + 1);
    setCurrentPath(newPath);
    setSelectedItem(null);
    
    if (index === 0) {
      setCurrentFolderId(null);
    } else {
      setCurrentFolderId(null);
    }
  };

  const handleItemClick = (item: TreeNode) => {
    if (isRenaming === item.id) return;
    setSelectedItem(item);
  };

  const handleItemDoubleClick = (item: TreeNode) => {
    if (isRenaming === item.id) return;
    
    if (item.type === 'folder') {
      handleFolderNavigate(item.id, item.name);
    }
  };

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem) {
      setIsRenaming(selectedItem.id);
      setNewName(selectedItem.name);
      setOriginalName(selectedItem.name);
    }
    setIsActionsOpen(false);
  };

  const handleColorChangeClick = (e: React.MouseEvent, color: string) => {
    e.stopPropagation();
    if (selectedItem && selectedItem.type === 'folder') {
      handleColorChange(selectedItem.id, selectedItem.type, color, selectedItem.name);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedItem) {
      handleDelete(selectedItem.id, selectedItem.type);
    }
  };

  const handleUploadFromLocal = () => {
    toast({
      title: "Bilgi",
      description: "Yerel dosya yükleme özelliği yakında eklenecek",
    });
  };

  const handleUploadFromURL = () => {
    toast({
      title: "Bilgi", 
      description: "URL'den dosya yükleme özelliği yakında eklenecek",
    });
  };

  const handleRefresh = () => {
    loadFileTree();
  };

  // Drag and drop handlers
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

  const FileManagerSkeleton = () => {
    return (
      <div className={`grid gap-3 ${viewMode === 'grid' ? (isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6') : 'grid-cols-1'}`}>
        {Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="flex flex-col items-center gap-2 p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-900">
            <Skeleton className="h-8 w-8 rounded" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    );
  };

  const filteredItems = getFilteredAndSortedItems();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-6xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
        style={{ 
          minHeight: isMobile ? '600px' : '700px',
          maxHeight: '90vh'
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">Dosya Yöneticisi</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col h-full">
          {/* Toolbar */}
          <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
            {/* First Row - Upload, Create buttons */}
            <div className="flex gap-2 flex-wrap">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground">
                    <Upload size={16} />
                    Dosya Yükle
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem onClick={handleUploadFromLocal} className="text-gray-700 dark:text-gray-200">
                    <Upload size={14} className="mr-2" />
                    Upload from local
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleUploadFromURL} className="text-gray-700 dark:text-gray-200">
                    <Upload size={14} className="mr-2" />
                    Upload from URL
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              <Button size="sm" variant="outline" onClick={handleCreateFolder} className="flex items-center gap-2">
                <FolderPlus size={16} />
                Klasör Oluştur
              </Button>

              <Button size="sm" variant="outline" onClick={handleCreateFile} className="flex items-center gap-2">
                <FilePlus size={16} />
                Dosya Oluştur
              </Button>

              <Button size="sm" variant="outline" onClick={handleRefresh} className="flex items-center gap-2">
                <RefreshCw size={16} />
                Yenile
              </Button>
            </div>
            
            {/* Second Row - Search */}
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

          {/* Navigation Bar with Breadcrumb and Actions */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-900">
            {/* Breadcrumb with Home Icon */}
            <div className="flex items-center gap-2">
              {currentPath.map((path, index) => (
                <React.Fragment key={index}>
                  {index === 0 && <Home size={16} className="text-gray-500 dark:text-gray-400" />}
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

            {/* Right Side Actions */}
            <div className="flex items-center gap-2">
              {/* Actions Button */}
              <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={!selectedItem}
                    className="flex items-center gap-2"
                  >
                    <MoreVertical size={16} />
                    Actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem onClick={handleRenameClick} className="text-gray-700 dark:text-gray-200">
                    <Edit3 size={14} className="mr-2" />
                    Yeniden Adlandır
                  </DropdownMenuItem>

                  {selectedItem?.type === 'folder' && (
                    <DropdownMenuItem 
                      onSelect={(e) => {
                        e.preventDefault();
                        setIsColorPaletteOpen(true);
                      }}
                      className="text-gray-700 dark:text-gray-200"
                    >
                      <Palette size={14} className="mr-2" />
                      Renk Seç
                    </DropdownMenuItem>
                  )}
                  
                  <DropdownMenuItem onClick={handleDeleteClick} className="text-gray-700 dark:text-gray-200">
                    <Trash2 size={14} className="mr-2" />
                    Sil
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Sort Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" variant="outline" className="flex items-center gap-2">
                    Sort
                    <ChevronDown size={14} />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                  <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('asc'); }} className="text-gray-700 dark:text-gray-200">
                    File name - ASC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                    File name - DESC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('asc'); }} className="text-gray-700 dark:text-gray-200">
                    Uploaded date - ASC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                    Uploaded date - DESC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('size'); setSortOrder('asc'); }} className="text-gray-700 dark:text-gray-200">
                    Size - ASC
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => { setSortBy('size'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                    Size - DESC
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
                <Button
                  size="sm"
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('grid')}
                  className="px-2 rounded-none border-0"
                >
                  <Grid3X3 size={16} />
                </Button>
                <Button
                  size="sm"
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  onClick={() => setViewMode('list')}
                  className="px-2 rounded-none border-0"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>
          </div>

          {/* File List with proper scrolling */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full p-4" style={{ minHeight: isMobile ? '400px' : '500px' }}>
              {isLoading ? (
                <FileManagerSkeleton />
              ) : (
                <div className={`grid gap-3 ${
                  viewMode === 'grid' 
                    ? (isMobile ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6')
                    : 'grid-cols-1'
                }`}>
                  {filteredItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const folderColorClass = item.type === 'folder' 
                      ? (hasChildren ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500')
                      : 'text-gray-500 dark:text-gray-400';
                    
                    const isSelected = selectedItem?.id === item.id;

                    if (viewMode === 'list') {
                      return (
                        <div
                          key={`${item.type}-${item.id}`}
                          draggable
                          onDragStart={(e) => handleDragStart(e, item)}
                          onDragOver={(e) => handleDragOver(e, item.id, item.type)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, item.id, item.type)}
                          className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                            isSelected 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                              : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                          } ${
                            draggedItem?.id === item.id ? 'opacity-50 scale-95' : ''
                          } ${
                            dragOverItem === item.id && item.type === 'folder' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                          } bg-white dark:bg-gray-900`}
                          onClick={() => handleItemClick(item)}
                          onDoubleClick={() => handleItemDoubleClick(item)}
                        >
                          {/* Selection indicator */}
                          {isSelected && (
                            <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <Check size={12} className="text-white" />
                            </div>
                          )}
                          
                          <div className="flex-shrink-0">
                            {item.type === 'folder' ? (
                              <Folder 
                                size={24} 
                                className={item.color ? '' : folderColorClass}
                                color={item.color || undefined}
                              />
                            ) : (
                              <File 
                                size={24} 
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
                                    setOriginalName('');
                                  }
                                }}
                                className="h-8 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                autoFocus
                                onClick={(e) => e.stopPropagation()}
                              />
                            ) : (
                              <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">
                                {item.name}
                              </div>
                            )}
                          </div>
                          
                          <div className="text-xs text-gray-500 dark:text-gray-400 flex-shrink-0">
                            {item.updated_at || item.created_at || '2025-05-13 15:09:49'}
                          </div>
                        </div>
                      );
                    }

                    return (
                      <div
                        key={`${item.type}-${item.id}`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        onDragOver={(e) => handleDragOver(e, item.id, item.type)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, item.id, item.type)}
                        className={`relative flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                          isSelected 
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                            : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                        } ${
                          draggedItem?.id === item.id ? 'opacity-50 scale-95' : ''
                        } ${
                          dragOverItem === item.id && item.type === 'folder' ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''
                        } bg-white dark:bg-gray-900`}
                        onClick={() => handleItemClick(item)}
                        onDoubleClick={() => handleItemDoubleClick(item)}
                      >
                        {/* Selection indicator */}
                        {isSelected && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check size={12} className="text-white" />
                          </div>
                        )}
                        
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
                        
                        <div className="w-full text-center">
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
                                  setOriginalName('');
                                }
                              }}
                              className="h-6 text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-center"
                              autoFocus
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div className={`text-xs font-medium truncate px-1 py-1 rounded ${
                              isSelected ? 'bg-blue-500 text-white' : 'text-gray-900 dark:text-gray-100'
                            }`}>
                              {item.name}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              {!isLoading && filteredItems.length === 0 && !searchQuery && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Folder size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>Bu klasör boş</p>
                  <p className="text-sm mt-1">Yeni dosya veya klasör oluşturabilirsiniz</p>
                </div>
              )}
              
              {!isLoading && filteredItems.length === 0 && searchQuery && (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
                  <p>Arama sonucu bulunamadı</p>
                  <p className="text-sm mt-1">"{searchQuery}" için sonuç bulunamadı</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        {/* Color Palette Dialog */}
        {isColorPaletteOpen && (
          <AlertDialog open={isColorPaletteOpen} onOpenChange={setIsColorPaletteOpen}>
            <AlertDialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <AlertDialogHeader>
                <div className="flex items-center justify-between">
                  <AlertDialogTitle className="text-gray-900 dark:text-gray-100">Renk Seç</AlertDialogTitle>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsColorPaletteOpen(false)}
                    className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <AlertDialogDescription className="text-gray-600 dark:text-gray-400">
                  {selectedItem?.name} için bir renk seçin.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="grid grid-cols-8 gap-2 p-4">
                {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#000000'].map((color) => (
                  <button
                    key={color}
                    className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500"
                    style={{ backgroundColor: color }}
                    onClick={(e) => handleColorChangeClick(e, color)}
                  />
                ))}
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600">
                  İptal
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FileManager;
