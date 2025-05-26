
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Ruler, ZoomIn, ZoomOut, Maximize, File, Code
} from 'lucide-react';

interface ViewToolbarProps {
  onToggleRuler: () => void;
  showRuler: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  zoom: string;
  setZoom: (zoom: string) => void;
  lineHeight: string;
  setLineHeight: (height: string) => void;
  onToggleFullscreen: () => void;
  onToggleViewSource: () => void;
  viewSource: boolean;
  isMobile: boolean;
}

const ViewToolbar: React.FC<ViewToolbarProps> = ({
  onToggleRuler,
  showRuler,
  onZoomIn,
  onZoomOut,
  zoom,
  setZoom,
  lineHeight,
  setLineHeight,
  onToggleFullscreen,
  onToggleViewSource,
  viewSource,
  isMobile
}) => {
  const zoomOptions = ['50%', '75%', '100%', '125%', '150%', '200%'];
  
  const buttonClass = `${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`;

  return (
    <div className="flex items-center gap-1 flex-shrink-0">
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={showRuler ? "default" : "ghost"}
            size="icon" 
            className={buttonClass}
            onClick={onToggleRuler}
          >
            <Ruler size={isMobile ? 14 : 16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{showRuler ? 'Cetveli Gizle' : 'Cetveli Göster'}</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={buttonClass}
            onClick={onZoomOut}
          >
            <ZoomOut size={isMobile ? 14 : 16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Uzaklaştır</TooltipContent>
      </Tooltip>
      
      {/* Zoom Select */}
      <Select 
        value={zoom} 
        onValueChange={(value) => {
          setZoom(value);
          const zoomValue = parseInt(value.replace('%', '')) / 100;
          const editorParent = document.querySelector('[contenteditable="true"]')?.parentElement;
          if (editorParent) {
            editorParent.style.transform = `scale(${zoomValue})`;
            editorParent.style.transformOrigin = 'top center';
          }
        }}
      >
        <SelectTrigger className={`${isMobile ? 'w-16 h-7 text-xs' : 'w-20 h-8'} text-sm border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-gray-200 flex-shrink-0`}>
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 shadow-lg z-50">
          {zoomOptions.map((option) => (
            <SelectItem key={option} value={option} className="dark:text-gray-200 dark:hover:bg-gray-600">
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={buttonClass}
            onClick={onZoomIn}
          >
            <ZoomIn size={isMobile ? 14 : 16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Yakınlaştır</TooltipContent>
      </Tooltip>
      
      {/* Line height select */}
      <select 
        className={`border border-gray-200 dark:border-gray-600 rounded text-sm py-1 px-2 flex-shrink-0 bg-white dark:bg-gray-700 dark:text-gray-200 pointer-events-auto cursor-pointer ${isMobile ? 'w-16 text-xs' : 'w-20'}`}
        value={lineHeight}
        onChange={(e) => {
          e.stopPropagation();
          setLineHeight(e.target.value);
          const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
          if (editorDiv) {
            editorDiv.style.lineHeight = e.target.value;
          }
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <option value="normal">Normal</option>
        <option value="1">1</option>
        <option value="1.15">1.15</option>
        <option value="1.5">1.5</option>
        <option value="2">2</option>
        <option value="2.5">2.5</option>
        <option value="3">3</option>
      </select>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant={viewSource ? "default" : "ghost"}
            size="icon" 
            className={buttonClass}
            onClick={onToggleViewSource}
          >
            <Code size={isMobile ? 14 : 16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{viewSource ? 'Normal Görünüm' : 'Kaynak Görünümü'}</TooltipContent>
      </Tooltip>
      
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon" 
            className={buttonClass}
            onClick={onToggleFullscreen}
          >
            <Maximize size={isMobile ? 14 : 16} />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Tam Ekran</TooltipContent>
      </Tooltip>
    </div>
  );
};

export default ViewToolbar;
