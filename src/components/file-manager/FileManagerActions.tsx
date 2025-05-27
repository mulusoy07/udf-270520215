
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { X } from 'lucide-react';
import { TreeNode } from '@/services/fileService';

interface FileManagerActionsProps {
  isColorPaletteOpen: boolean;
  setIsColorPaletteOpen: (open: boolean) => void;
  deleteDialogOpen: boolean;
  setDeleteDialogOpen: (open: boolean) => void;
  selectedItem: TreeNode | null;
  itemToDelete: TreeNode | null;
  onColorChange: (e: React.MouseEvent, color: string) => void;
  onConfirmDelete: () => void;
}

const FileManagerActions: React.FC<FileManagerActionsProps> = ({
  isColorPaletteOpen,
  setIsColorPaletteOpen,
  deleteDialogOpen,
  setDeleteDialogOpen,
  selectedItem,
  itemToDelete,
  onColorChange,
  onConfirmDelete
}) => {
  return (
    <>
      {/* Color Palette Dialog */}
      {isColorPaletteOpen && (
        <Dialog open={isColorPaletteOpen} onOpenChange={setIsColorPaletteOpen}>
          <DialogContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">Renk Seç</DialogTitle>
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
                  onClick={(e) => onColorChange(e, color)}
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
        onConfirm={onConfirmDelete}
        confirmText="Sil"
        cancelText="İptal"
      />
    </>
  );
};

export default FileManagerActions;
