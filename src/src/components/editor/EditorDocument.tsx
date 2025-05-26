
import React from 'react';

interface EditorDocumentProps {
  editorRef: React.RefObject<HTMLDivElement>;
  a4Width: string;
  a4MinHeight: string;
  a4WidthPx: number;
  leftMarker: number;
  rightMarker: number;
  onFormatText: (command: string, value?: string) => void;
  onClearFormatting: () => void;
  isMobile: boolean;
}

const EditorDocument: React.FC<EditorDocumentProps> = ({
  editorRef,
  a4Width,
  a4MinHeight,
  a4WidthPx,
  leftMarker,
  rightMarker,
  onFormatText,
  onClearFormatting,
  isMobile
}) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Handle keyboard shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          onFormatText('bold');
          break;
        case 'i':
          e.preventDefault();
          onFormatText('italic');
          break;
        case 'u':
          e.preventDefault();
          onFormatText('underline');
          break;
        case 'z':
          e.preventDefault();
          onFormatText('undo');
          break;
        case 'y':
          e.preventDefault();
          onFormatText('redo');
          break;
        default:
          break;
      }
    }
  };

  return (
    <div className="flex-1 overflow-auto bg-gray-100 dark:bg-gray-900 p-2">
      <style>{`
        /* Mobile responsive table styles */
        @media (max-width: 768px) {
          [contenteditable="true"] table {
            width: 100% !important;
            font-size: 10px !important;
            border-collapse: collapse !important;
            margin: 10px 0 !important;
            border: 1px solid #ccc !important;
            table-layout: fixed !important;
            word-wrap: break-word !important;
          }
          
          [contenteditable="true"] td, 
          [contenteditable="true"] th {
            padding: 4px !important;
            border: 1px solid #ccc !important;
            text-align: left !important;
            word-wrap: break-word !important;
            overflow-wrap: break-word !important;
            hyphens: auto !important;
            min-width: 0 !important;
            max-width: none !important;
          }
          
          [contenteditable="true"] th {
            background-color: #f5f5f5 !important;
            font-weight: bold !important;
            font-size: 9px !important;
          }
          
          /* Dark mode mobile table styles */
          .dark [contenteditable="true"] table {
            border: 1px solid #6b7280 !important;
          }
          
          .dark [contenteditable="true"] td, 
          .dark [contenteditable="true"] th {
            border: 1px solid #6b7280 !important;
            color: #e5e7eb !important;
            background-color: #4b5563 !important;
          }
          
          .dark [contenteditable="true"] th {
            background-color: #374151 !important;
            font-weight: bold !important;
          }
        }
        
        /* Desktop table styles */
        @media (min-width: 769px) {
          [contenteditable="true"] table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 10px 0 !important;
            border: 1px solid #ccc !important;
          }
          
          [contenteditable="true"] td, 
          [contenteditable="true"] th {
            border: 1px solid #ccc !important;
            padding: 8px !important;
            text-align: left !important;
          }
          
          [contenteditable="true"] th {
            background-color: #f5f5f5 !important;
            font-weight: bold !important;
          }
          
          /* Dark mode desktop table styles */
          .dark [contenteditable="true"] table {
            border: 1px solid #6b7280 !important;
          }
          
          .dark [contenteditable="true"] td, 
          .dark [contenteditable="true"] th {
            border: 1px solid #6b7280 !important;
            color: #e5e7eb !important;
            background-color: #4b5563 !important;
          }
          
          .dark [contenteditable="true"] th {
            background-color: #374151 !important;
            font-weight: bold !important;
          }
        }
      `}</style>
      <div className="flex justify-center">
        <div
          ref={editorRef}
          className="bg-white dark:bg-gray-800 shadow-lg border border-gray-300 dark:border-gray-600 outline-none focus:ring-1 focus:ring-gray-400 dark:focus:ring-gray-500 focus:border-gray-400 dark:focus:border-gray-500"
          style={{
            width: a4Width,
            minHeight: a4MinHeight,
            paddingLeft: isMobile ? '1cm' : `${leftMarker}px`,
            paddingRight: isMobile ? '1cm' : `${a4WidthPx - rightMarker}px`,
            paddingTop: '5px',
            paddingBottom: '5px',
            fontFamily: 'Georgia, serif',
            fontSize: '12pt',
            lineHeight: '1.5',
            color: 'var(--foreground)',
            overflowWrap: 'break-word',
            wordWrap: 'break-word',
          }}
          contentEditable
          suppressContentEditableWarning
          onKeyDown={handleKeyDown}
          spellCheck={false}
          data-placeholder="Belgenizi yazmaya başlayın..."
        />
      </div>
    </div>
  );
};

export default EditorDocument;
