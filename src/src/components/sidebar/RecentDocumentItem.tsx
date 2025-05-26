
import React from 'react';
import { File } from 'lucide-react';

interface RecentDocumentItemProps {
  name: string;
  date: string;
  onClick: () => void;
}

const RecentDocumentItem: React.FC<RecentDocumentItemProps> = ({ name, date, onClick }) => {
  return (
    <div 
      className="group flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center overflow-hidden">
        <File size={16} className="text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0" />
        <div className="overflow-hidden">
          <div className="text-sm font-medium truncate text-gray-900 dark:text-gray-100">{name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{date}</div>
        </div>
      </div>
    </div>
  );
};

export default RecentDocumentItem;
