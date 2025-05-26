
import React from 'react';
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { 
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Image, Table, Link, Eraser, Strikethrough
} from 'lucide-react';

interface FormatToolbarProps {
  onFormatText: (command: string, value?: string) => void;
  onInsertImage: () => void;
  onInsertTable: () => void;
  onInsertLink: () => void;
  onClearFormatting: () => void;
  isMobile: boolean;
}

const FormatToolbar: React.FC<FormatToolbarProps> = ({
  onFormatText,
  onInsertImage,
  onInsertTable,
  onInsertLink,
  onClearFormatting,
  isMobile
}) => {
  const handleBulletList = () => {
    console.log('Handling bullet list');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      onFormatText('insertUnorderedList');
    }
  };

  const handleNumberedList = () => {
    console.log('Handling numbered list');
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      onFormatText('insertOrderedList');
    }
  };

  const handleTableClick = () => {
    console.log('FormatToolbar: Table button clicked');
    onInsertTable();
  };

  const handleLinkClick = () => {
    console.log('FormatToolbar: Link button clicked');
    onInsertLink();
  };

  const buttonClass = `${isMobile ? "h-7 w-7" : "h-8 w-8"} hover:bg-gray-200 dark:hover:bg-gray-700 dark:text-gray-200`;
  const dividerClass = "h-6 border-r border-gray-300 dark:border-gray-600 mx-1 flex-shrink-0";

  return (
    <>
      {/* Formatting buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('bold')}
            >
              <Bold size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Kalın</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('italic')}
            >
              <Italic size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>İtalik</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('underline')}
            >
              <Underline size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Altı Çizili</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('strikeThrough')}
            >
              <Strikethrough size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Üstü Çizili</TooltipContent>
        </Tooltip>
      </div>
      
      <div className={dividerClass}></div>
      
      {/* Alignment buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('justifyLeft')}
            >
              <AlignLeft size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sola Hizala</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('justifyCenter')}
            >
              <AlignCenter size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Ortaya Hizala</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('justifyRight')}
            >
              <AlignRight size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Sağa Hizala</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={() => onFormatText('justifyFull')}
            >
              <AlignJustify size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tam Hizala</TooltipContent>
        </Tooltip>
      </div>
      
      <div className={dividerClass}></div>
      
      {/* List buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={handleBulletList}
            >
              <List size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Madde İşaretli Liste</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={handleNumberedList}
            >
              <ListOrdered size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Numaralı Liste</TooltipContent>
        </Tooltip>
      </div>
      
      <div className={dividerClass}></div>
      
      {/* Insert buttons */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={onInsertImage}
            >
              <Image size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Resim Ekle</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={handleTableClick}
            >
              <Table size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Tablo Ekle</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={handleLinkClick}
            >
              <Link size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Bağlantı Ekle</TooltipContent>
        </Tooltip>
      </div>
      
      <div className={dividerClass}></div>
      
      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className={buttonClass}
              onClick={onClearFormatting}
            >
              <Eraser size={isMobile ? 14 : 16} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Biçimlendirmeyi Temizle</TooltipContent>
        </Tooltip>
      </div>
    </>
  );
};

export default FormatToolbar;
