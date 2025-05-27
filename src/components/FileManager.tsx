import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { fileService, folderService, TreeNode, addCacheListener, removeCacheListener } from '@/services/fileService';
import FileManagerDialog from './file-manager/FileManagerDialog';
import FileManagerContent from './file-manager/FileManagerContent';
import FileManagerActions from './file-manager/FileManagerActions';

interface FileManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const FileManager: React.FC<FileManagerProps> = ({ open, onOpenChange }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Dosyalarım']);
  const [currentFolderId, setCurrentFolderId] = useState<number | null>(null);
  const [isRenaming, setIsRenaming] = useState<number | null>(null);
  const [newName, setNewName] = useState('');
  const [originalName, setOriginalName] = useState('');
  const [selectedItem, setSelectedItem] = useState<TreeNode | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileTree, setFileTree] = useState<TreeNode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'name' | 'created_at'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [isActionsOpen, setIsActionsOpen] = useState(false);
  const [isColorPaletteOpen, setIsColorPaletteOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<TreeNode | null>(null);
  const [draggedItem, setDraggedItem] = useState<TreeNode | null>(null);
  const { toast } = useToast();

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const listener = (newTree: TreeNode[]) => {
      setFileTree(newTree);
    };
    
    addCacheListener(listener);
    return () => removeCacheListener(listener);
  }, []);

  useEffect(() => {
    if (open) {
      loadFileTree(false);
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
    
    if (searchQuery.trim()) {
      items = items.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    const folders = items.filter(item => item.type === 'folder');
    const files = items.filter(item => item.type === 'file');
    
    // Sort folders by created_at
    folders.sort((a, b) => {
      if (sortBy === 'created_at') {
        const dateA = new Date(a.created_at || '2025-05-13 15:09:49').getTime();
        const dateB = new Date(b.created_at || '2025-05-13 15:09:49').getTime();
        const comparison = dateA - dateB;
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
    
    // Sort files based on selected criteria
    files.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created_at':
          comparison = new Date(a.created_at || '2025-05-13 15:09:49').getTime() - 
                      new Date(b.created_at || '2025-05-13 15:09:49').getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    return [...folders, ...files];
  };

  const generateUniqueId = () => {
    const now = new Date();
    const timestamp = now.getTime().toString();
    return timestamp.slice(-6); // Son 6 karakter
  };

  const generateUniqueFolderName = () => {
    const uniqueId = generateUniqueId();
    return `Yeni Klasör ${uniqueId}`;
  };

  const generateUniqueFileName = () => {
    const uniqueId = generateUniqueId();
    return `Yeni Belge ${uniqueId}.udf`;
  };

  const handleCreateFolder = async () => {
    const uniqueFolderName = generateUniqueFolderName();
    const result = await folderService.createFolder({
      name: uniqueFolderName,
      parent_id: currentFolderId || undefined
    });

    if (result.success && result.data) {
      setIsRenaming(result.data.id);
      setNewName(uniqueFolderName);
      setOriginalName(uniqueFolderName);
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
    const uniqueFileName = generateUniqueFileName();
    const result = await fileService.createFile({
      name: uniqueFileName,
      folder_id: currentFolderId || undefined,
      type: 'udf',
      mime_type: 'text/plain', // Default mime type
      size: 0 // Default size
    });

    if (result.success && result.data) {
      setIsRenaming(result.data.id);
      setNewName(uniqueFileName);
      setOriginalName(uniqueFileName);
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

  const handleRenameCancel = () => {
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

  const handleDragStart = (e: React.DragEvent, item: TreeNode) => {
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = async (e: React.DragEvent, targetFolder: TreeNode) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetFolder.id || targetFolder.type !== 'folder') {
      setDraggedItem(null);
      return;
    }

    try {
      // Önce cache'i güncelle (optimistic update)
      const cacheUpdateSuccess = fileService.moveItemInCache(draggedItem.id, targetFolder.id);
      
      if (!cacheUpdateSuccess) {
        toast({
          title: "Hata",
          description: "Cache güncellemesi başarısız oldu",
          variant: "destructive"
        });
        setDraggedItem(null);
        return;
      }

      // Başarılı cache güncellemesi sonrası toast göster
      toast({
        title: "Başarılı",
        description: `${draggedItem.name} ${targetFolder.name} klasörüne taşındı`,
      });

      // Arka planda API çağrısı yap (cache güncellenmesi zaten yapıldı)
      if (draggedItem.type === 'file') {
        const result = await fileService.updateFile(draggedItem.id, { 
          folder_id: targetFolder.id,
          name: draggedItem.name
        });
        
        // API başarısız olursa cache'i geri yükle
        if (!result.success) {
          console.error('API call failed, reloading cache:', result.message);
          await loadFileTree(false);
          toast({
            title: "Uyarı",
            description: "Taşıma işlemi tamamlanamadı, dosya yapısı yenilendi",
            variant: "destructive"
          });
        }
      } else {
        const result = await folderService.updateFolder(draggedItem.id, { 
          parent_id: targetFolder.id,
          name: draggedItem.name
        });
        
        // API başarısız olursa cache'i geri yükle
        if (!result.success) {
          console.error('API call failed, reloading cache:', result.message);
          await loadFileTree(false);
          toast({
            title: "Uyarı",
            description: "Taşıma işlemi tamamlanamadı, dosya yapısı yenilendi",
            variant: "destructive"
          });
        }
      }
    } catch (error) {
      console.error('Error moving item:', error);
      // Hata durumunda cache'i yeniden yükle
      await loadFileTree(false);
      toast({
        title: "Hata",
        description: "Taşıma işlemi sırasında hata oluştu, dosya yapısı yenilendi",
        variant: "destructive"
      });
    }
    
    setDraggedItem(null);
  };

  const filteredItems = getFilteredAndSortedItems();

  return (
    <>
      <FileManagerDialog
        open={open}
        onOpenChange={onOpenChange}
        isMobile={isMobile}
        currentPath={currentPath}
        onBreadcrumbClick={handleBreadcrumbClick}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        isActionsOpen={isActionsOpen}
        setIsActionsOpen={setIsActionsOpen}
        selectedItem={selectedItem}
        onCreateFolder={handleCreateFolder}
        onCreateFile={handleCreateFile}
        onRefresh={handleRefresh}
        onUploadFromLocal={handleUploadFromLocal}
        onUploadFromURL={handleUploadFromURL}
        onRenameClick={handleRenameClick}
        onDeleteClick={handleDeleteClick}
        onColorClick={() => setIsColorPaletteOpen(true)}
      >
        <FileManagerContent
          isLoading={isLoading}
          filteredItems={filteredItems}
          searchQuery={searchQuery}
          viewMode={viewMode}
          isMobile={isMobile}
          selectedItem={selectedItem}
          isRenaming={isRenaming}
          newName={newName}
          setNewName={setNewName}
          onItemClick={handleItemClick}
          onItemDoubleClick={handleItemDoubleClick}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onRename={handleRename}
          onRenameCancel={handleRenameCancel}
        />
      </FileManagerDialog>

      <FileManagerActions
        isColorPaletteOpen={isColorPaletteOpen}
        setIsColorPaletteOpen={setIsColorPaletteOpen}
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        selectedItem={selectedItem}
        itemToDelete={itemToDelete}
        onColorChange={handleColorChangeClick}
        onConfirmDelete={confirmDelete}
      />
    </>
  );
};

export default FileManager;
