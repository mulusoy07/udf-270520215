
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import FormatToolbar from './toolbar/FormatToolbar';
import FontToolbar from './toolbar/FontToolbar';
import ActionToolbar from './toolbar/ActionToolbar';
import ViewToolbar from './toolbar/ViewToolbar';

interface EditorToolbarProps {
  fontSize: string;
  setFontSize: (size: string) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  textColor: string;
  setTextColor: (color: string) => void;
  bgColor: string;
  setBgColor: (color: string) => void;
  lineHeight: string;
  setLineHeight: (height: string) => void;
  zoom: string;
  setZoom: (zoom: string) => void;
  onFormatText: (command: string, value?: string) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
  onInsertImage: () => void;
  onInsertTable: () => void;
  onInsertLink: () => void;
  onClearFormatting: () => void;
  onToggleRuler: () => void;
  showRuler: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  fontSize, setFontSize, fontFamily, setFontFamily, textColor, setTextColor,
  bgColor, setBgColor, lineHeight, setLineHeight, zoom, setZoom,
  onFormatText, onZoomIn, onZoomOut, onToggleFullscreen,
  onInsertImage, onInsertTable, onInsertLink, onClearFormatting, onToggleRuler, showRuler
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const [viewSource, setViewSource] = useState(false);

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
    } else {
      setShowLeftArrow(false);
      setShowRightArrow(false);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -100, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 100, behavior: 'smooth' });
      setTimeout(checkScroll, 300);
    }
  };

  const handleToggleViewSource = () => {
    const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (editorDiv) {
      if (viewSource) {
        // Switch back to rendered view
        const content = editorDiv.textContent || '';
        editorDiv.innerHTML = content;
        editorDiv.contentEditable = 'true';
        editorDiv.style.fontFamily = 'inherit';
        editorDiv.style.whiteSpace = 'normal';
      } else {
        // Switch to source view
        const content = editorDiv.innerHTML;
        editorDiv.textContent = content;
        editorDiv.contentEditable = 'true';
        editorDiv.style.fontFamily = 'monospace';
        editorDiv.style.whiteSpace = 'pre-wrap';
      }
      setViewSource(!viewSource);
    }
  };

  // Enhanced debug function handlers
  const handleTableInsert = () => {
    console.log('EditorToolbar: Table button clicked - calling onInsertTable callback');
    console.log('EditorToolbar: onInsertTable function:', onInsertTable);
    if (typeof onInsertTable === 'function') {
      onInsertTable();
      console.log('EditorToolbar: onInsertTable called successfully');
    } else {
      console.error('EditorToolbar: onInsertTable is not a function:', typeof onInsertTable);
    }
  };

  const handleLinkInsert = () => {
    console.log('EditorToolbar: Link button clicked - calling onInsertLink callback');
    console.log('EditorToolbar: onInsertLink function:', onInsertLink);
    if (typeof onInsertLink === 'function') {
      onInsertLink();
      console.log('EditorToolbar: onInsertLink called successfully');
    } else {
      console.error('EditorToolbar: onInsertLink is not a function:', typeof onInsertLink);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-2 relative">
      {/* Scroll arrows */}
      {showLeftArrow && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute left-2 z-10 bg-white dark:bg-gray-800 w-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
          style={{ height: '32px' }}
          onClick={scrollLeft}
        >
          <ChevronLeft size={14} />
        </Button>
      )}
      
      {showRightArrow && (
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-2 z-10 bg-white dark:bg-gray-800 w-6 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-200"
          style={{ height: '32px' }}
          onClick={scrollRight}
        >
          <ChevronRight size={14} />
        </Button>
      )}

      <div 
        ref={scrollContainerRef}
        className={`flex items-center gap-1 overflow-x-auto scrollbar-hide ${showLeftArrow ? 'pl-8' : ''} ${showRightArrow ? 'pr-8' : 'pr-2'} no-wrap`}
        onScroll={checkScroll}
        style={{ 
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          whiteSpace: 'nowrap'
        }}
      >
        <style>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
          .no-wrap > * {
            flex-shrink: 0;
          }
        `}</style>

        <FontToolbar 
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          textColor={textColor}
          setTextColor={setTextColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          onFormatText={onFormatText}
          isMobile={isMobile}
        />

        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1 flex-shrink-0"></div>

        <ActionToolbar 
          onFormatText={onFormatText}
          isMobile={isMobile}
        />

        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1 flex-shrink-0"></div>

        <FormatToolbar 
          onFormatText={onFormatText}
          onInsertImage={onInsertImage}
          onInsertTable={handleTableInsert}
          onInsertLink={handleLinkInsert}
          onClearFormatting={onClearFormatting}
          isMobile={isMobile}
        />

        <div className="h-6 border-r border-gray-300 dark:border-gray-600 mx-1 flex-shrink-0"></div>

        <ViewToolbar 
          onToggleRuler={onToggleRuler}
          showRuler={showRuler}
          onZoomIn={onZoomIn}
          onZoomOut={onZoomOut}
          zoom={zoom}
          setZoom={setZoom}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
          onToggleFullscreen={onToggleFullscreen}
          onToggleViewSource={handleToggleViewSource}
          viewSource={viewSource}
          isMobile={isMobile}
        />
      </div>
    </div>
  );
};

export default EditorToolbar;
