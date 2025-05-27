
import React from 'react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Folder, File, Search, Check } from 'lucide-react';
import { TreeNode } from '@/services/fileService';

interface FileManagerContentProps {
  isLoading: boolean;
  filteredItems: TreeNode[];
  searchQuery: string;
  viewMode: 'grid' | 'list';
  isMobile: boolean;
  selectedItem: TreeNode | null;
  isRenaming: number | null;
  newName: string;
  setNewName: (name: string) => void;
  onItemClick: (item: TreeNode) => void;
  onItemDoubleClick: (item: TreeNode) => void;
  onDragStart: (e: React.DragEvent, item: TreeNode) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, item: TreeNode) => void;
  onRename: (id: number, type: 'file' | 'folder') => void;
  onRenameCancel: () => void;
}

const FileManagerContent: React.FC<FileManagerContentProps> = ({
  isLoading,
  filteredItems,
  searchQuery,
  viewMode,
  isMobile,
  selectedItem,
  isRenaming,
  newName,
  setNewName,
  onItemClick,
  onItemDoubleClick,
  onDragStart,
  onDragOver,
  onDrop,
  onRename,
  onRenameCancel
}) => {
  const getFileNameWithoutExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return fileName;
    return fileName.substring(0, lastDotIndex);
  };

  const getFileExtension = (fileName: string) => {
    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1) return '';
    return fileName.substring(lastDotIndex);
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

  if (isLoading) {
    return <FileManagerSkeleton />;
  }

  if (filteredItems.length === 0 && !searchQuery) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Folder size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p>Bu klasör boş</p>
        <p className="text-sm mt-1">Yeni dosya veya klasör oluşturabilirsiniz</p>
      </div>
    );
  }

  if (filteredItems.length === 0 && searchQuery) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        <Search size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
        <p>Arama sonucu bulunamadı</p>
        <p className="text-sm mt-1">"{searchQuery}" için sonuç bulunamadı</p>
      </div>
    );
  }

  return (
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
              onClick={() => onItemClick(item)}
              onDoubleClick={() => onItemDoubleClick(item)}
              draggable={true}
              onDragStart={(e) => onDragStart(e, item)}
              onDragOver={item.type === 'folder' ? onDragOver : undefined}
              onDrop={item.type === 'folder' ? (e) => onDrop(e, item) : undefined}
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
                    value={item.type === 'file' ? getFileNameWithoutExtension(newName) : newName}
                    onChange={(e) => {
                      if (item.type === 'file') {
                        const extension = getFileExtension(item.name);
                        setNewName(e.target.value + extension);
                      } else {
                        setNewName(e.target.value);
                      }
                    }}
                    onBlur={() => onRename(item.id, item.type)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onRename(item.id, item.type);
                      } else if (e.key === 'Escape') {
                        onRenameCancel();
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
                {item.created_at || '2025-05-13 15:09:49'}
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
            onClick={() => onItemClick(item)}
            onDoubleClick={() => onItemDoubleClick(item)}
            draggable={true}
            onDragStart={(e) => onDragStart(e, item)}
            onDragOver={item.type === 'folder' ? onDragOver : undefined}
            onDrop={item.type === 'folder' ? (e) => onDrop(e, item) : undefined}
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
                  value={item.type === 'file' ? getFileNameWithoutExtension(newName) : newName}
                  onChange={(e) => {
                    if (item.type === 'file') {
                      const extension = getFileExtension(item.name);
                      setNewName(e.target.value + extension);
                    } else {
                      setNewName(e.target.value);
                    }
                  }}
                  onBlur={() => onRename(item.id, item.type)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onRename(item.id, item.type);
                    } else if (e.key === 'Escape') {
                      onRenameCancel();
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
  );
};

export default FileManagerContent;
