
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Folder, File, Plus, Trash2, Edit3, FolderPlus, FilePlus, MoreVertical } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

interface FileManagerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FileItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  children?: FileItem[];
}

const FileManager: React.FC<FileManagerProps> = ({ open, onOpenChange }) => {
  const [currentPath, setCurrentPath] = useState<string[]>(['Kök Dizin']);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isRenaming, setIsRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const { toast } = useToast();

  const [fileStructure, setFileStructure] = useState<FileItem[]>([
    {
      id: '1',
      name: 'Projeler',
      type: 'folder',
      parentId: null,
      children: [
        { id: '1-1', name: 'Proje 1.udf', type: 'file', parentId: '1' },
        { id: '1-2', name: 'Proje 2.udf', type: 'file', parentId: '1' }
      ]
    },
    {
      id: '2',
      name: 'Sözleşmeler',
      type: 'folder',
      parentId: null,
      children: [
        { id: '2-1', name: 'İş Sözleşmesi.udf', type: 'file', parentId: '2' }
      ]
    },
    { id: '3', name: 'Belge.udf', type: 'file', parentId: null }
  ]);

  const getCurrentItems = () => {
    if (currentPath.length === 1) {
      return fileStructure;
    }
    
    let current = fileStructure;
    for (let i = 1; i < currentPath.length; i++) {
      const folder = current.find(item => item.name === currentPath[i] && item.type === 'folder');
      if (folder && folder.children) {
        current = folder.children;
      }
    }
    return current;
  };

  const handleCreateFolder = () => {
    const newFolder: FileItem = {
      id: Date.now().toString(),
      name: 'Yeni Klasör',
      type: 'folder',
      parentId: null,
      children: []
    };

    setFileStructure(prev => [...prev, newFolder]);
    setIsRenaming(newFolder.id);
    setNewName('Yeni Klasör');
    
    toast({
      title: "Klasör Oluşturuldu",
      description: "Yeni klasör başarıyla oluşturuldu.",
    });
  };

  const handleCreateFile = () => {
    const newFile: FileItem = {
      id: Date.now().toString(),
      name: 'Yeni Belge.udf',
      type: 'file',
      parentId: null
    };

    setFileStructure(prev => [...prev, newFile]);
    setIsRenaming(newFile.id);
    setNewName('Yeni Belge.udf');
    
    toast({
      title: "Dosya Oluşturuldu",
      description: "Yeni dosya başarıyla oluşturuldu.",
    });
  };

  const handleRename = (id: string) => {
    setFileStructure(prev => 
      prev.map(item => 
        item.id === id ? { ...item, name: newName } : item
      )
    );
    setIsRenaming(null);
    setNewName('');
    
    toast({
      title: "Yeniden Adlandırıldı",
      description: "Öğe başarıyla yeniden adlandırıldı.",
    });
  };

  const handleDelete = (id: string) => {
    setFileStructure(prev => prev.filter(item => item.id !== id));
    
    toast({
      title: "Silindi",
      description: "Öğe başarıyla silindi.",
    });
  };

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    
    if (draggedItem && draggedItem !== targetId) {
      toast({
        title: "Taşındı",
        description: "Öğe başarıyla taşındı.",
      });
    }
    
    setDraggedItem(null);
  };

  const currentItems = getCurrentItems();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
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
                  onClick={() => setCurrentPath(currentPath.slice(0, index + 1))}
                >
                  {path}
                </button>
                {index < currentPath.length - 1 && <span className="text-gray-400 dark:text-gray-500">/</span>}
              </React.Fragment>
            ))}
          </div>

          {/* File List */}
          <ScrollArea className="flex-1 p-4 bg-white dark:bg-gray-900">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {currentItems.map((item) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, item.id)}
                  className={`flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors bg-white dark:bg-gray-900 ${
                    draggedItem === item.id ? 'opacity-50' : ''
                  }`}
                  onDoubleClick={() => {
                    if (item.type === 'folder') {
                      setCurrentPath([...currentPath, item.name]);
                    }
                  }}
                >
                  <div className="flex-shrink-0">
                    {item.type === 'folder' ? (
                      <Folder size={20} className="text-blue-500 dark:text-blue-400" />
                    ) : (
                      <File size={20} className="text-gray-500 dark:text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    {isRenaming === item.id ? (
                      <Input
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                        onBlur={() => handleRename(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleRename(item.id);
                          } else if (e.key === 'Escape') {
                            setIsRenaming(null);
                            setNewName('');
                          }
                        }}
                        className="h-6 text-sm bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{item.name}</span>
                    )}
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreVertical size={14} />
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
                              onClick={() => handleDelete(item.id)}
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
              ))}
            </div>
            
            {currentItems.length === 0 && (
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
