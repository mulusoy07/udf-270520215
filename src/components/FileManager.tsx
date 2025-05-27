import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Folder, File, FolderPlus, FilePlus, Home, Edit3, Trash2, Palette, Search, Check, MoreVertical, Upload, RefreshCw, Grid3X3, List, ChevronDown, X, Calendar, FileText, ArrowUpDown } from 'lucide-react';
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
  const [isLoading, setIsLoading] = useState(false);
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'size'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TreeNode | null>(null);
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
      loadFileTree(false); // İlk açılışta cache kullanma
      setSelectedItem(null);
    }
  }, [open]);

  const loadFileTree = async (useCache: boolean = true) => {
    setIsLoading(true);
    try {
      const result = await fileService.getFileTree(useCache);
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
          comparison = new Date(a.updated_at || a.created_at || '2025-05-13 15:09:49').getTime() - 
                      new Date(b.updated_at || b.created_at || '2025-05-13 15:09:49').getTime();
          break;
        case 'size':
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
    setDeleteDialogOpen(false);
    setItemToDelete(null);
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
      setItemToDelete(selectedItem);
      setDeleteDialogOpen(true);
    }
    setIsActionsOpen(false);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      handleDelete(itemToDelete.id, itemToDelete.type);
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
    loadFileTree(false);
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
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent 
          className="sm:max-w-6xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-0 flex flex-col"
          style={{ 
            height: isMobile ? '85vh' : '90vh',
            maxHeight: isMobile ? '85vh' : '90vh'
          }}
        >
          <div className="flex flex-col h-full overflow-hidden">
            {/* Header */}
            <DialogHeader className="p-6 pb-0 flex-shrink-0">
              <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">Dosya Yöneticisi</DialogTitle>
            </DialogHeader>
            
            {/* Toolbar - Mobile Optimized */}
            {isMobile ? (
              <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                {/* Top Row - Upload Button and Icons */}
                <div className="flex items-center gap-2">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium">
                        <Upload size={16} className="mr-2" />
                        Upload
                        <ChevronDown size={14} className="ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <DropdownMenuItem onClick={handleUploadFromLocal} className="text-gray-700 dark:text-gray-200">
                        <Upload size={14} className="mr-2" />
                        Yerel Dosyadan Yükle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleUploadFromURL} className="text-gray-700 dark:text-gray-200">
                        <Upload size={14} className="mr-2" />
                        URL'den Yükle
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleCreateFolder}
                    className="p-2.5 border border-gray-300 dark:border-gray-600"
                  >
                    <FolderPlus size={16} />
                  </Button>
                  
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={handleRefresh}
                    className="p-2.5 border border-gray-300 dark:border-gray-600"
                  >
                    <RefreshCw size={16} />
                  </Button>
                </div>
                
                {/* Search Bar */}
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
                  <Input
                    type="text"
                    placeholder="Search in current folder"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                  />
                </div>
                
                {/* Bottom Row - Filters and View */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 text-sm">
                      All media
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="outline" className="text-sm">
                          <ArrowUpDown size={14} className="mr-1" />
                          Sort
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                        <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('asc'); }} className="text-gray-700 dark:text-gray-200">
                          Dosya Adı - A'dan Z'ye
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                          Tarih - Yeniden Eskiye
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    
                    <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={!selectedItem}
                          className="text-sm"
                        >
                          <MoreVertical size={14} className="mr-1" />
                          İşlemler
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
              </div>
            ) : (
              <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                {/* Desktop Layout - Keep existing */}
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
                        Yerel Dosyadan Yükle
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleUploadFromURL} className="text-gray-700 dark:text-gray-200">
                        <Upload size={14} className="mr-2" />
                        URL'den Yükle
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
            )}

            {/* Navigation Bar with Breadcrumb and Actions */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 flex-shrink-0">
              {/* Breadcrumb */}
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {currentPath.map((path, index) => (
                  <React.Fragment key={index}>
                    {index === 0 && <Home size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />}
                    <button
                      className="text-blue-600 dark:text-blue-400 hover:underline truncate"
                      onClick={() => handleBreadcrumbClick(index)}
                    >
                      {path}
                    </button>
                    {index < currentPath.length - 1 && <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">/</span>}
                  </React.Fragment>
                ))}
              </div>

              {/* Desktop Actions */}
              {!isMobile && (
                <div className="flex items-center gap-2">
                  <DropdownMenu open={isActionsOpen} onOpenChange={setIsActionsOpen}>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={!selectedItem}
                        className="flex items-center gap-2"
                      >
                        <MoreVertical size={16} />
                        İşlemler
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

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <ArrowUpDown size={16} />
                        Sırala
                        <ChevronDown size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
                      <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('asc'); }} className="text-gray-700 dark:text-gray-200">
                        <FileText size={14} className="mr-2" />
                        Dosya Adı - A'dan Z'ye
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                        <FileText size={14} className="mr-2" />
                        Dosya Adı - Z'den A'ya
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('asc'); }} className="text-gray-700 dark:text-gray-200">
                        <Calendar size={14} className="mr-2" />
                        Yükleme Tarihi - Eskiden Yeniye
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => { setSortBy('date'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                        <Calendar size={14} className="mr-2" />
                        Yükleme Tarihi - Yeniden Eskiye
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

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
              )}
            </div>

            {/* File List with proper scrolling */}
            <div className="flex-1 min-h-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
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
                              className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                                isSelected 
                                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                  : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                              } bg-white dark:bg-gray-900`}
                              onClick={() => handleItemClick(item)}
                              onDoubleClick={() => handleItemDoubleClick(item)}
                            >
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
                            className={`relative flex flex-col items-center gap-2 p-3 border rounded-lg cursor-pointer transition-all ${
                              isSelected 
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                                : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                            } bg-white dark:bg-gray-900`}
                            onClick={() => handleItemClick(item)}
                            onDoubleClick={() => handleItemDoubleClick(item)}
                          >
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
                </div>
              </ScrollArea>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Color Palette Dialog */}
      {isColorPaletteOpen && (
        <Dialog open={isColorPaletteOpen} onOpenChange={setIsColorPaletteOpen}>
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <DialogTitle className="text-gray-900 dark:text-gray-100">Renk Seç</DialogTitle>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsColorPaletteOpen(false)}
                  className="h-6 w-6 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {selectedItem?.name} için bir renk seçin.
              </div>
            </DialogHeader>
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
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Silme İşlemini Onayla"
        description={`"${itemToDelete?.name}" ${itemToDelete?.type === 'folder' ? 'klasörünü' : 'dosyasını'} silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
        onConfirm={confirmDelete}
        confirmText="Sil"
        cancelText="İptal"
      />
    </>
  );
};

export default FileManager;
