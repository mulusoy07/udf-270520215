
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight, LucideProps } from 'lucide-react';

interface SidebarSectionProps {
  title: string;
  icon: React.ComponentType<LucideProps>;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ 
  title, 
  icon: Icon, 
  open, 
  onOpenChange, 
  children 
}) => {
  return (
    <Collapsible open={open} onOpenChange={onOpenChange}>
      <CollapsibleTrigger className="flex items-center justify-between w-full p-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 shadow-sm transition-all duration-150">
        <div className="flex items-center">
          <Icon size={16} className="text-gray-600 dark:text-gray-300 mr-3" />
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{title}</span>
        </div>
        <div className="transition-transform duration-150">
          {open ? <ChevronDown size={14} className="text-gray-600 dark:text-gray-300" /> : <ChevronRight size={14} className="text-gray-600 dark:text-gray-300" />}
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-2 transition-all duration-150 ease-out">
        <div className="space-y-1 px-2">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SidebarSection;
