
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronDown, ChevronRight, Eye, Edit, Trash2, Palette } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface FileTreeItemProps {
  item: {
    id: number;
    name: string;
    type: 'file' | 'folder';
    icon: React.ComponentType<{ size?: number; className?: string }>;
    hasChildren?: boolean;
    children?: any[];
    color?: string;
  };
  level?: number;
  expandedFolders: string[];
  onToggleFolder: (folderName: string) => void;
  onFileClick: (fileName: string) => void;
  onFileAction: (action: string, fileName: string, color?: string) => void;
}

const FileTreeItem: React.FC<FileTreeItemProps> = ({
  item,
  level = 0,
  expandedFolders,
  onToggleFolder,
  onFileClick,
  onFileAction
}) => {
  const isExpanded = expandedFolders.includes(item.name);
  const paddingLeft = level * 12;

  if (item.type === 'folder') {
    const folderColor = item.hasChildren 
      ? 'text-blue-600 dark:text-blue-400' 
      : 'text-gray-400 dark:text-gray-500';

    return (
      <div key={`folder-${item.id}`}>
        <div 
          className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => onToggleFolder(item.name)}
        >
          {isExpanded ? <ChevronDown size={14} className="mr-1 text-gray-500 dark:text-gray-400" /> : <ChevronRight size={14} className="mr-1 text-gray-500 dark:text-gray-400" />}
          <item.icon 
            size={16} 
            className={`mr-2 ${folderColor}`} 
            style={{ color: item.color || undefined }}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
        </div>
        {isExpanded && item.children && item.children.length > 0 && (
          <div>
            {item.children.map((child: any) => (
              <FileTreeItem
                key={`item-${child.id}`}
                item={child}
                level={level + 1}
                expandedFolders={expandedFolders}
                onToggleFolder={onToggleFolder}
                onFileClick={onFileClick}
                onFileAction={onFileAction}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      key={`file-${item.id}`}
      className="group flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
      style={{ paddingLeft: `${paddingLeft + 8}px` }}
      onClick={() => onFileClick(item.name)}
    >
      <div className="flex items-center overflow-hidden">
        <item.icon 
          size={16} 
          className="text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" 
          style={{ color: item.color || undefined }}
        />
        <span className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{item.name}</span>
      </div>
      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-600" title="Görüntüle" onClick={(e) => e.stopPropagation()}>
              <Eye size={14} className="text-gray-500 dark:text-gray-400" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Belgeyi Görüntüle</AlertDialogTitle>
              <AlertDialogDescription>
                {item.name} dosyasını görüntülemek istediğinizden emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={() => onFileAction('görüntüleme', item.name)}>
                Görüntüle
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-600" title="Düzenle" onClick={(e) => e.stopPropagation()}>
              <Edit size={14} className="text-gray-500 dark:text-gray-400" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Belgeyi Düzenle</AlertDialogTitle>
              <AlertDialogDescription>
                {item.name} dosyasını düzenlemek istediğinizden emin misiniz?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={() => onFileAction('düzenleme', item.name)}>
                Düzenle
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-600" title="Renk Ayarla" onClick={(e) => e.stopPropagation()}>
              <Palette size={14} className="text-gray-500 dark:text-gray-400" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Renk Seç</AlertDialogTitle>
              <AlertDialogDescription>
                {item.name} için bir renk seçin.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="grid grid-cols-6 gap-2 p-4">
              {['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280', '#000000'].map((color) => (
                <button
                  key={color}
                  className="w-8 h-8 rounded-full border-2 border-gray-300 hover:border-gray-500"
                  style={{ backgroundColor: color }}
                  onClick={() => onFileAction('renk', item.name, color)}
                />
              ))}
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-gray-200 dark:hover:bg-gray-600" title="Sil" onClick={(e) => e.stopPropagation()}>
              <Trash2 size={14} className="text-gray-500 dark:text-gray-400" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Belgeyi Sil</AlertDialogTitle>
              <AlertDialogDescription>
                {item.name} dosyasını silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>İptal</AlertDialogCancel>
              <AlertDialogAction onClick={() => onFileAction('silme', item.name)} className="bg-destructive hover:bg-destructive/90">
                Sil
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default FileTreeItem;
