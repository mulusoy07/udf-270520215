
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Search, Upload, FolderPlus, FilePlus, RefreshCw, ChevronDown, ArrowUpDown, MoreVertical, Grid3X3, List, Edit3, Trash2, Palette, FileText, Calendar } from 'lucide-react';
import { TreeNode } from '@/services/fileService';

interface FileManagerToolbarProps {
  isMobile: boolean;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  sortBy: 'name' | 'created_at';
  setSortBy: (sort: 'name' | 'created_at') => void;
  sortOrder: 'asc' | 'desc';
  setSortOrder: (order: 'asc' | 'desc') => void;
  isActionsOpen: boolean;
  setIsActionsOpen: (open: boolean) => void;
  selectedItem: TreeNode | null;
  onCreateFolder: () => void;
  onCreateFile: () => void;
  onRefresh: () => void;
  onUploadFromLocal: () => void;
  onUploadFromURL: () => void;
  onRenameClick: (e: React.MouseEvent) => void;
  onDeleteClick: (e: React.MouseEvent) => void;
  onColorClick: () => void;
}

const FileManagerToolbar: React.FC<FileManagerToolbarProps> = ({
  isMobile,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  isActionsOpen,
  setIsActionsOpen,
  selectedItem,
  onCreateFolder,
  onCreateFile,
  onRefresh,
  onUploadFromLocal,
  onUploadFromURL,
  onRenameClick,
  onDeleteClick,
  onColorClick
}) => {
  if (isMobile) {
    return (
      <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md text-sm font-medium">
                <Upload size={16} className="mr-2" />
                Yükle
                <ChevronDown size={14} className="ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <DropdownMenuItem onClick={onUploadFromLocal} className="text-gray-700 dark:text-gray-200">
                <Upload size={14} className="mr-2" />
                Yerel Dosyadan Yükle
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onUploadFromURL} className="text-gray-700 dark:text-gray-200">
                <Upload size={14} className="mr-2" />
                URL'den Yükle
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onCreateFolder}
            className="p-2.5 border border-gray-300 dark:border-gray-600"
          >
            <FolderPlus size={16} />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onCreateFile}
            className="p-2.5 border border-gray-300 dark:border-gray-600"
          >
            <FilePlus size={16} />
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onRefresh}
            className="p-2.5 border border-gray-300 dark:border-gray-600"
          >
            <RefreshCw size={16} />
          </Button>
        </div>
        
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          <Input
            type="text"
            placeholder="Mevcut klasörde ara"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline" className="text-sm">
                  <ArrowUpDown size={14} className="mr-1" />
                  Sırala
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
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
          </div>
          
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
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex-shrink-0">
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
            <DropdownMenuItem onClick={onUploadFromLocal} className="text-gray-700 dark:text-gray-200">
              <Upload size={14} className="mr-2" />
              Yerel Dosyadan Yükle
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onUploadFromURL} className="text-gray-700 dark:text-gray-200">
              <Upload size={14} className="mr-2" />
              URL'den Yükle
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button size="sm" variant="outline" onClick={onCreateFolder} className="flex items-center gap-2">
          <FolderPlus size={16} />
          Klasör Oluştur
        </Button>

        <Button size="sm" variant="outline" onClick={onCreateFile} className="flex items-center gap-2">
          <FilePlus size={16} />
          Dosya Oluştur
        </Button>

        <Button size="sm" variant="outline" onClick={onRefresh} className="flex items-center gap-2">
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
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 bg-white dark:bg-gray-900 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
        />
      </div>
    </div>
  );
};

export default FileManagerToolbar;
