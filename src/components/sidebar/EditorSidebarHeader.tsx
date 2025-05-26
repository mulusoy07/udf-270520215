
import React from 'react';
import { FileText } from 'lucide-react';

interface EditorSidebarHeaderProps {
  collapsed: boolean;
}

const EditorSidebarHeader: React.FC<EditorSidebarHeaderProps> = ({ collapsed }) => {
  if (collapsed) {
    return (
      <div className="flex flex-col items-center py-2 border-b border-gray-200 dark:border-gray-600 w-full">
        <FileText size={20} className="text-blue-600 dark:text-blue-400 mb-1" />
        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 text-center leading-tight">UDF</span>
      </div>
    );
  }

  return (
    <div className="flex items-center p-3 mb-2 border-b border-gray-200 dark:border-gray-600">
      <FileText size={24} className="text-blue-600 dark:text-blue-400 mr-3" />
      <div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">UDF Editor</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400">Belge Düzenleyici</p>
      </div>
    </div>
  );
};

export default EditorSidebarHeader;
