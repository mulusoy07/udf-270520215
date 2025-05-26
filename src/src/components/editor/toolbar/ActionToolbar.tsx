
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Undo, Redo } from 'lucide-react';

interface ActionToolbarProps {
  onFormatText: (command: string, value?: string) => void;
  isMobile: boolean;
}

const ActionToolbar: React.FC<ActionToolbarProps> = ({
  onFormatText,
  isMobile
}) => {
  return (
    <div className="flex flex-shrink-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`}
            onClick={() => onFormatText('undo')}
          >
            <Undo size={isMobile ? 14 : 16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Geri Al</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`}
            onClick={() => onFormatText('redo')}
          >
            <Redo size={isMobile ? 14 : 16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Yinele</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ActionToolbar;
