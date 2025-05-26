
import React from 'react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface FontToolbarProps {
  fontSize: string;
  setFontSize: (size: string) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  onFormatText: (command: string, value?: string) => void;
  isMobile: boolean;
}

const FontToolbar: React.FC<FontToolbarProps> = ({
  fontSize, setFontSize, fontFamily, setFontFamily, textColor, setTextColor,
  bgColor, setBgColor, onFormatText, isMobile
}) => {
  return (
    <div className={`flex items-center gap-1 flex-shrink-0 ${isMobile ? 'ml-0.5' : ''}`}>
      {/* Font family select */}
      <select 
        className={`border border-gray-200 dark:border-gray-600 rounded text-sm py-1 px-2 flex-shrink-0 bg-white dark:bg-gray-700 dark:text-gray-200 pointer-events-auto cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 ${isMobile ? 'w-20 text-xs' : 'w-24'}`}
        value={fontFamily}
        onChange={(e) => {
          e.stopPropagation();
          setFontFamily(e.target.value);
          onFormatText('fontName', e.target.value);
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <option value="Arial">Arial</option>
        <option value="Georgia">Georgia</option>
        <option value="Times New Roman">Times</option>
        <option value="Helvetica">Helvetica</option>
        <option value="Courier New">Courier</option>
        <option value="Verdana">Verdana</option>
      </select>
      
      {/* Font size select */}
      <select 
        className={`border border-gray-200 dark:border-gray-600 rounded text-sm py-1 px-2 flex-shrink-0 bg-white dark:bg-gray-700 dark:text-gray-200 pointer-events-auto cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 ${isMobile ? 'w-14 text-xs' : 'w-16'}`}
        value={fontSize}
        onChange={(e) => {
          e.stopPropagation();
          const newSize = e.target.value;
          setFontSize(newSize);
          onFormatText('fontSize', newSize === '12' ? '2' : 
                       newSize === '14' ? '3' : 
                       newSize === '16' ? '4' : 
                       newSize === '18' ? '5' : '6');
        }}
        onMouseDown={(e) => e.stopPropagation()}
        onTouchStart={(e) => e.stopPropagation()}
      >
        <option value="10">10</option>
        <option value="12">12</option>
        <option value="14">14</option>
        <option value="16">16</option>
        <option value="18">18</option>
        <option value="24">24</option>
        <option value="36">36</option>
      </select>
      
      {/* Text and background color */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <input 
                type="color" 
                value={textColor}
                onChange={(e) => {
                  setTextColor(e.target.value);
                  onFormatText('foreColor', e.target.value);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`border border-gray-300 dark:border-gray-500 cursor-pointer pointer-events-auto rounded bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`}
                title="Yazı Rengi"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>Yazı Rengi</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="relative">
              <input 
                type="color" 
                value={bgColor === 'transparent' ? '#ffffff' : bgColor}
                onChange={(e) => {
                  setBgColor(e.target.value);
                  onFormatText('hiliteColor', e.target.value);
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className={`border border-gray-300 dark:border-gray-500 cursor-pointer pointer-events-auto rounded bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 ${isMobile ? 'w-5 h-5' : 'w-6 h-6'}`}
                title="Arka Plan Rengi"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent>Arka Plan Rengi</TooltipContent>
        </Tooltip>
      </div>
    </div>
  );
};

export default FontToolbar;
