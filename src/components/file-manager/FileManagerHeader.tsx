
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';

const FileManagerHeader: React.FC = () => {
  return (
    <DialogHeader className="p-6 pb-0 flex-shrink-0">
      <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">Dosya Yöneticisi</DialogTitle>
    </DialogHeader>
  );
};

export default FileManagerHeader;
