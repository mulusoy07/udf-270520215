
import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ChevronDown, ChevronRight, Eye, Edit, Trash2 } from 'lucide-react';

interface FileTreeItemProps {
  item: {
    name: string;
    type: 'file' | 'folder';
    icon: React.ComponentType<{ size?: number; className?: string }>;
    children?: any[];
  };
  level?: number;
  expandedFolders: string[];
  onToggleFolder: (folderName: string) => void;
  onFileClick: (fileName: string) => void;
  onFileAction: (action: string, fileName: string) => void;
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
    return (
      <div key={item.name}>
        <div 
          className="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
          style={{ paddingLeft: `${paddingLeft + 8}px` }}
          onClick={() => onToggleFolder(item.name)}
        >
          {isExpanded ? <ChevronDown size={14} className="mr-1 text-gray-500 dark:text-gray-400" /> : <ChevronRight size={14} className="mr-1 text-gray-500 dark:text-gray-400" />}
          <item.icon size={16} className="text-gray-500 dark:text-gray-400 mr-2" />
          <span className="text-sm font-medium text-gray-900 dark:text-gray-100">{item.name}</span>
        </div>
        {isExpanded && item.children && (
          <div>
            {item.children.map((child: any) => (
              <FileTreeItem
                key={child.name}
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
      key={item.name}
      className="group flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
      style={{ paddingLeft: `${paddingLeft + 8}px` }}
      onClick={() => onFileClick(item.name)}
    >
      <div className="flex items-center overflow-hidden">
        <item.icon size={16} className="text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
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
