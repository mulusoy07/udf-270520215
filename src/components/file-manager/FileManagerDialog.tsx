
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import FileManagerHeader from './FileManagerHeader';
import FileManagerToolbar from './FileManagerToolbar';
import FileManagerBreadcrumb from './FileManagerBreadcrumb';
import FileManagerContent from './FileManagerContent';
import FileManagerActions from './FileManagerActions';
import { TreeNode } from '@/services/fileService';

interface FileManagerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isMobile: boolean;
  currentPath: string[];
  onBreadcrumbClick: (index: number) => void;
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
  children: React.ReactNode;
}

const FileManagerDialog: React.FC<FileManagerDialogProps> = ({
  open,
  onOpenChange,
  isMobile,
  currentPath,
  onBreadcrumbClick,
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
  onColorClick,
  children
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-6xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 p-0 flex flex-col"
        style={{ 
          height: isMobile ? '85vh' : '90vh',
          maxHeight: isMobile ? '85vh' : '90vh'
        }}
      >
        <div className="flex flex-col h-full overflow-hidden">
          <FileManagerHeader />
          
          <FileManagerToolbar
            isMobile={isMobile}
            searchQuery={searchQuery}
            onSearchChange={onSearchChange}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            isActionsOpen={isActionsOpen}
            setIsActionsOpen={setIsActionsOpen}
            selectedItem={selectedItem}
            onCreateFolder={onCreateFolder}
            onCreateFile={onCreateFile}
            onRefresh={onRefresh}
            onUploadFromLocal={onUploadFromLocal}
            onUploadFromURL={onUploadFromURL}
            onRenameClick={onRenameClick}
            onDeleteClick={onDeleteClick}
            onColorClick={onColorClick}
          />

          <FileManagerBreadcrumb
            currentPath={currentPath}
            onBreadcrumbClick={onBreadcrumbClick}
            isMobile={isMobile}
            isActionsOpen={isActionsOpen}
            setIsActionsOpen={setIsActionsOpen}
            selectedItem={selectedItem}
            sortBy={sortBy}
            setSortBy={setSortBy}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
            onRenameClick={onRenameClick}
            onDeleteClick={onDeleteClick}
            onColorClick={onColorClick}
            viewMode={viewMode}
            onViewModeChange={onViewModeChange}
          />

          <div className="flex-1 min-h-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                {children}
              </div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FileManagerDialog;
