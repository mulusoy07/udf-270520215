
import React from 'react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Home, MoreVertical, ArrowUpDown, ChevronDown, Grid3X3, List, Edit3, Trash2, Palette, FileText, Calendar } from 'lucide-react';
import { TreeNode } from '@/services/fileService';

interface FileManagerBreadcrumbProps {
  currentPath: string[];
  onBreadcrumbClick: (index: number) => void;
  isMobile: boolean;
  isActionsOpen: boolean;
  setIsActionsOpen: (open: boolean) => void;
  selectedItem: TreeNode | null;
  sortBy: 'name' | 'created_at';
  setSortBy: (sort: 'name' | 'created_at') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  onRenameClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onColorClick: () => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const FileManagerBreadcrumb: React.FC<FileManagerBreadcrumbProps> = ({
  currentPath,
  onBreadcrumbClick,
  isMobile,
  isActionsOpen,
  setIsActionsOpen,
  selectedItem,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  onRenameClick,
  onDeleteClick,
  onColorClick,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 flex-shrink-0">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {currentPath.map((path, index) => (
          <React.Fragment key={index}>
            {index === 0 && <Home size={16} className="text-gray-500 dark:text-gray-400 flex-shrink-0" />}
            <button
              className="text-blue-600 dark:text-blue-400 hover:underline truncate"
              onClick={() => onBreadcrumbClick(index)}
            >
              {path}
            </button>
            {index < currentPath.length - 1 && <span className="text-gray-400 dark:text-gray-500 flex-shrink-0">/</span>}
          </React.Fragment>
        ))}
      </div>

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
              <DropdownMenuItem onClick={onRenameClick} className="text-gray-700 dark:text-gray-200">
                <Edit3 size={14} className="mr-2" />
                Yeniden Adlandır
              </DropdownMenuItem>

              {selectedItem?.type === 'folder' && (
                <DropdownMenuItem 
                  onSelect={(e) => {
                    e.preventDefault();
                    onColorClick();
                  }}
                  className="text-gray-700 dark:text-gray-200"
                >
                  <Palette size={14} className="mr-2" />
                  Renk Seç
                </DropdownMenuItem>
              )}
              
              <DropdownMenuItem onClick={onDeleteClick} className="text-gray-700 dark:text-gray-200">
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
                Dosya - A'dan Z'ye
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('name'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                <FileText size={14} className="mr-2" />
                Dosya - Z'den A'ya
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('created_at'); setSortOrder('asc'); }} className="text-gray-700 dark:text-gray-200">
                <Calendar size={14} className="mr-2" />
                Oluşturulma - Eskiden Yeniye
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => { setSortBy('created_at'); setSortOrder('desc'); }} className="text-gray-700 dark:text-gray-200">
                <Calendar size={14} className="mr-2" />
                Oluşturulma - Yeniden Eskiye
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="flex border border-gray-300 dark:border-gray-600 rounded overflow-hidden">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('grid')}
              className="px-2 rounded-none border-0"
            >
              <Grid3X3 size={16} />
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              onClick={() => onViewModeChange('list')}
              className="px-2 rounded-none border-0"
            >
              <List size={16} />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManagerBreadcrumb;
