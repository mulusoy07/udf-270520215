import React, { useState, useRef, useCallback, useEffect } from 'react';
import EditorRuler from '@/components/editor/EditorRuler';
import EditorDocument from '@/components/editor/EditorDocument';
import EditorToolbar from '@/components/editor/EditorToolbar';
import FileToolbar from '@/components/editor/FileToolbar';
import ImageInsertDialog from '@/components/editor/ImageInsertDialog';
import TableInsertDialog from '@/components/editor/TableInsertDialog';
import LinkInsertDialog from '@/components/editor/LinkInsertDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { DarkModeProvider } from '@/contexts/DarkModeContext';

const EditorContent: React.FC = () => {
  const [showRuler, setShowRuler] = useState(true);
  const [rulerPosition, setRulerPosition] = useState(0);
  const [isDraggingLeft, setIsDraggingLeft] = useState(false);
  const [isDraggingRight, setIsDraggingRight] = useState(false);
  
  // Dialog states
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [tableDialogOpen, setTableDialogOpen] = useState(false);
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  
  // Editor toolbar states - default font changed to Arial
  const [fontSize, setFontSize] = useState('12');
  const [fontFamily, setFontFamily] = useState('Arial');
  const [textColor, setTextColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('transparent');
  const [lineHeight, setLineHeight] = useState('1.5');
  const [zoom, setZoom] = useState('100%');
  
  const isMobile = useMediaQuery('(max-width: 768px)');
  const editorRef = useRef<HTMLDivElement>(null);

  // A4 dimensions
  const a4WidthCm = 21;
  const a4HeightCm = 29.7;
  const cmToPx = isMobile ? 25 : 37.8;
  const a4WidthPx = a4WidthCm * cmToPx;
  const a4HeightPx = a4HeightCm * cmToPx;
  const a4Width = isMobile ? '95%' : `${a4WidthPx}px`;
  const a4MinHeight = `${a4HeightPx}px`;

  const getDefaultMarkerPositions = useCallback(() => {
    const visibleWidth = isMobile ? window.innerWidth * 0.95 : a4WidthPx;
    const leftDefault = 0.5 * cmToPx;
    const rightDefault = Math.min(visibleWidth - (0.5 * cmToPx), a4WidthPx - (0.5 * cmToPx));
    return { left: leftDefault, right: rightDefault };
  }, [isMobile, a4WidthPx, cmToPx]);

  const [leftMarker, setLeftMarker] = useState(() => getDefaultMarkerPositions().left);
  const [rightMarker, setRightMarker] = useState(() => getDefaultMarkerPositions().right);

  useEffect(() => {
    const defaultPositions = getDefaultMarkerPositions();
    setLeftMarker(defaultPositions.left);
    setRightMarker(defaultPositions.right);
  }, [isMobile, getDefaultMarkerPositions]);

  const formatText = (command: string, value?: string) => {
    console.log('Formatting text:', command, value);
    
    const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (!editorDiv) return;
    
    editorDiv.focus();
    
    if (command === 'insertUnorderedList') {
      console.log('Handling bullet list');
      document.execCommand('insertUnorderedList', false);
    } else if (command === 'insertOrderedList') {
      console.log('Handling numbered list');
      document.execCommand('insertOrderedList', false);
    } else {
      document.execCommand(command, false, value);
    }
  };

  const clearFormatting = () => {
    document.execCommand('removeFormat', false);
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };

  const handleLeftMarkerMove = (position: number) => {
    const maxPosition = a4WidthPx;
    const constrainedPosition = Math.max(0, Math.min(maxPosition, position));
    setLeftMarker(constrainedPosition);
  };

  const handleRightMarkerMove = (position: number) => {
    const maxPosition = a4WidthPx;
    const constrainedPosition = Math.max(0, Math.min(maxPosition, position));
    setRightMarker(constrainedPosition);
  };

  const handleToggleRuler = () => {
    console.log('Toggling ruler, current state:', showRuler);
    setShowRuler(prev => !prev);
  };

  const handleZoomIn = () => {
    const currentZoom = parseInt(zoom.replace('%', ''));
    if (currentZoom < 200) {
      const newZoom = `${Math.min(200, currentZoom + 25)}%`;
      setZoom(newZoom);
      applyZoom(newZoom);
    }
  };

  const handleZoomOut = () => {
    const currentZoom = parseInt(zoom.replace('%', ''));
    if (currentZoom > 50) {
      const newZoom = `${Math.max(50, currentZoom - 25)}%`;
      setZoom(newZoom);
      applyZoom(newZoom);
    }
  };

  const applyZoom = (zoomLevel: string) => {
    const zoomValue = parseInt(zoomLevel.replace('%', '')) / 100;
    if (editorRef.current?.parentElement) {
      editorRef.current.parentElement.style.transform = `scale(${zoomValue})`;
      editorRef.current.parentElement.style.transformOrigin = 'top center';
    }
  };

  useEffect(() => {
    applyZoom(zoom);
  }, [zoom]);

  const handleToggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  const handleInsertImage = (imageData: { src: string; alt: string; width?: string; height?: string }) => {
    const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (!editorDiv) return;
    
    editorDiv.focus();
    
    let imgStyle = 'max-width: 100%; height: auto;';
    if (imageData.width) imgStyle += ` width: ${imageData.width}px;`;
    if (imageData.height) imgStyle += ` height: ${imageData.height}px;`;
    
    const img = `<img src="${imageData.src}" alt="${imageData.alt}" style="${imgStyle}" />`;
    document.execCommand('insertHTML', false, img);
  };

  // Enhanced table and link handlers with better debugging
  const handleInsertTable = (tableData: { rows: number; cols: number; hasHeader: boolean }) => {
    console.log('EditorContent: handleInsertTable called with data:', tableData);
    console.log('EditorContent: Looking for editor div...');
    
    const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (!editorDiv) {
      console.error('EditorContent: Editor div not found!');
      return;
    }
    
    console.log('EditorContent: Editor div found, focusing...');
    editorDiv.focus();
    
    let tableHTML = '<table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ccc;">';
    
    for (let i = 0; i < tableData.rows; i++) {
      tableHTML += '<tr>';
      for (let j = 0; j < tableData.cols; j++) {
        const cellTag = (i === 0 && tableData.hasHeader) ? 'th' : 'td';
        const cellContent = (i === 0 && tableData.hasHeader) ? `Başlık ${j + 1}` : `Hücre ${i + 1}-${j + 1}`;
        const cellStyle = `padding: 8px; border: 1px solid #ccc; background-color: ${i === 0 && tableData.hasHeader ? '#f5f5f5' : 'white'}; ${i === 0 && tableData.hasHeader ? 'font-weight: bold;' : ''}`;
        tableHTML += `<${cellTag} style="${cellStyle}">${cellContent}</${cellTag}>`;
      }
      tableHTML += '</tr>';
    }
    
    tableHTML += '</table><p><br></p>';
    
    console.log('EditorContent: Generated table HTML:', tableHTML);
    console.log('EditorContent: Executing insertHTML command...');
    
    const result = document.execCommand('insertHTML', false, tableHTML);
    console.log('EditorContent: insertHTML result:', result);
    console.log('EditorContent: Table inserted successfully!');
    console.log('EditorContent: Current editor content:', editorDiv.innerHTML);
  };

  const handleInsertLink = (linkData: { url: string; text: string; target?: string }) => {
    console.log('EditorContent: handleInsertLink called with data:', linkData);
    console.log('EditorContent: Looking for editor div...');
    
    const editorDiv = document.querySelector('[contenteditable="true"]') as HTMLDivElement;
    if (!editorDiv) {
      console.error('EditorContent: Editor div not found!');
      return;
    }
    
    console.log('EditorContent: Editor div found, focusing...');
    editorDiv.focus();
    
    const targetAttr = linkData.target ? ` target="${linkData.target}"` : '';
    const linkHTML = `<a href="${linkData.url}"${targetAttr} style="color: #0066cc; text-decoration: underline; cursor: pointer;">${linkData.text}</a>`;
    
    console.log('EditorContent: Generated link HTML:', linkHTML);
    console.log('EditorContent: Executing insertHTML command...');
    
    const result = document.execCommand('insertHTML', false, linkHTML);
    console.log('EditorContent: insertHTML result:', result);
    console.log('EditorContent: Link inserted successfully!');
    console.log('EditorContent: Current editor content:', editorDiv.innerHTML);
  };

  // Enhanced toolbar callback handlers
  const handleTableDialogOpen = () => {
    console.log('EditorContent: Opening table dialog...');
    setTableDialogOpen(true);
  };

  const handleLinkDialogOpen = () => {
    console.log('EditorContent: Opening link dialog...');
    setLinkDialogOpen(true);
  };

  // File operations - keep existing code
  const checkUnsavedChanges = (action: () => void) => {
    if (editorRef.current && editorRef.current.innerHTML.trim() !== '') {
      setPendingAction(() => action);
      setConfirmDialogOpen(true);
      return false;
    }
    action();
    return true;
  };

  const handleConfirmAction = () => {
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
    setConfirmDialogOpen(false);
  };

  const handleNewDocument = () => {
    const action = () => {
      if (editorRef.current) {
        editorRef.current.innerHTML = '';
        console.log('New document created');
      }
    };
    checkUnsavedChanges(action);
  };

  const handleSaveDocument = () => {
    if (editorRef.current) {
      const content = editorRef.current.innerHTML;
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'document.html';
      a.click();
      URL.revokeObjectURL(url);
      console.log('Document saved');
    }
  };

  const handlePrintDocument = () => {
    window.print();
  };

  const handleOpenDocument = () => {
    const action = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.html,.txt';
      input.onchange = (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (editorRef.current) {
              editorRef.current.innerHTML = e.target?.result as string;
            }
          };
          reader.readAsText(file);
        }
      };
      input.click();
    };
    checkUnsavedChanges(action);
  };

  // Test amaçlı, sayfa yüklendiğinde belgeye hazır tablo ve link ekle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (editorRef.current && editorRef.current.innerHTML.trim() === '') {
        editorRef.current.innerHTML = `
          <h2>Test Belgesi</h2>
          <p>Bu belge tablo ve link ekleme özelliklerini test etmek için hazırlanmıştır.</p>
          
          <h3>Test Tablosu (2x2):</h3>
          <table style="border-collapse: collapse; width: 100%; margin: 10px 0; border: 1px solid #ccc;">
            <tr>
              <th style="padding: 8px; border: 1px solid #ccc; background-color: #f5f5f5; font-weight: bold;">Başlık 1</th>
              <th style="padding: 8px; border: 1px solid #ccc; background-color: #f5f5f5; font-weight: bold;">Başlık 2</th>
            </tr>
            <tr>
              <td style="padding: 8px; border: 1px solid #ccc; background-color: white;">Veri 1-1</td>
              <td style="padding: 8px; border: 1px solid #ccc; background-color: white;">Veri 1-2</td>
            </tr>
          </table>
          
          <h3>Test Bağlantısı:</h3>
          <p>Buraya tıklayarak Google'a gidebilirsiniz: <a href="https://www.google.com" target="_blank" style="color: #0066cc; text-decoration: underline; cursor: pointer;">Google'a Git</a></p>
          
          <p>Yukarıdaki tablo ve bağlantı doğrudan HTML olarak eklenmiştir. Toolbar'dan tablo ve link ekleme butonlarını da test edebilirsiniz.</p>
        `;
        console.log('Test content loaded into editor');
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <DarkModeProvider>
      <div className="flex-1 flex flex-col overflow-hidden">
        <style>{`
          /* Dark mode genel stiller */
          .dark [contenteditable="true"] {
            color: #e5e7eb !important;
            background-color: #374151 !important;
          }
          
          /* Dark mode link stilleri */
          .dark [contenteditable="true"] a {
            color: #60a5fa !important;
            text-decoration: underline !important;
            cursor: pointer !important;
          }
          
          /* Dark mode liste stilleri */
          .dark [contenteditable="true"] ul {
            list-style-type: disc !important;
            margin-left: 20px !important;
            padding-left: 10px !important;
          }
          
          .dark [contenteditable="true"] ol {
            list-style-type: decimal !important;
            margin-left: 20px !important;
            padding-left: 10px !important;
          }
          
          .dark [contenteditable="true"] li {
            margin: 5px 0 !important;
            display: list-item !important;
            color: #e5e7eb !important;
          }
          
          /* Dark mode tablo stilleri */
          .dark [contenteditable="true"] table {
            border-collapse: collapse !important;
            width: 100% !important;
            margin: 10px 0 !important;
            border: 1px solid #6b7280 !important;
          }
          
          .dark [contenteditable="true"] td, 
          .dark [contenteditable="true"] th {
            border: 1px solid #6b7280 !important;
            padding: 8px !important;
            text-align: left !important;
            color: #e5e7eb !important;
            background-color: #4b5563 !important;
          }
          
          .dark [contenteditable="true"] th {
            background-color: #374151 !important;
            font-weight: bold !important;
          }
          
          /* Light mode stilleri */
          [contenteditable="true"] a {
            color: #0066cc !important;
            text-decoration: underline !important;
            cursor: pointer !important;
          }
          
          [contenteditable="true"] ul {
            list-style-type: disc !important;
            margin-left: 20px !important;
            padding-left: 10px !important;
          }
          
          [contenteditable="true"] ol {
            list-style-type: decimal !important;
            margin-left: 20px !important;
            padding-left: 10px !important;
          }
          
          [contenteditable="true"] li {
            margin: 5px 0 !important;
            display: list-item !important;
          }
          
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

          /* Placeholder stilleri */
          [contenteditable="true"]:empty::before {
            content: "Birşeyler yazmaya başla...";
            color: #9ca3af;
            pointer-events: none;
            position: absolute;
          }
          
          .dark [contenteditable="true"]:empty::before {
            color: #6b7280;
          }
        `}</style>
        
        <FileToolbar
          onNewDocument={handleNewDocument}
          onSaveDocument={handleSaveDocument}
          onPrintDocument={handlePrintDocument}
          onOpenDocument={handleOpenDocument}
        />
        
        <EditorToolbar
          fontSize={fontSize}
          setFontSize={setFontSize}
          fontFamily={fontFamily}
          setFontFamily={setFontFamily}
          textColor={textColor}
          setTextColor={setTextColor}
          bgColor={bgColor}
          setBgColor={setBgColor}
          lineHeight={lineHeight}
          setLineHeight={setLineHeight}
          zoom={zoom}
          setZoom={setZoom}
          onFormatText={formatText}
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onToggleFullscreen={handleToggleFullscreen}
          onInsertImage={() => setImageDialogOpen(true)}
          onInsertTable={handleTableDialogOpen}
          onInsertLink={handleLinkDialogOpen}
          onClearFormatting={clearFormatting}
          onToggleRuler={handleToggleRuler}
          showRuler={showRuler}
        />
        
        {showRuler && (
          <EditorRuler
            showRuler={showRuler}
            leftMarker={leftMarker}
            rightMarker={rightMarker}
            rulerPosition={rulerPosition}
            isDraggingLeft={isDraggingLeft}
            isDraggingRight={isDraggingRight}
            onLeftMarkerDrag={setIsDraggingLeft}
            onRightMarkerDrag={setIsDraggingRight}
            onLeftMarkerMove={handleLeftMarkerMove}
            onRightMarkerMove={handleRightMarkerMove}
            a4Width={a4Width}
            a4WidthPx={a4WidthPx}
          />
        )}
        
        <EditorDocument
          editorRef={editorRef}
          a4Width={a4Width}
          a4MinHeight={a4MinHeight}
          a4WidthPx={a4WidthPx}
          leftMarker={leftMarker}
          rightMarker={rightMarker}
          onFormatText={formatText}
          onClearFormatting={clearFormatting}
          isMobile={isMobile}
        />

        <ImageInsertDialog
          open={imageDialogOpen}
          onOpenChange={setImageDialogOpen}
          onInsert={handleInsertImage}
        />
        
        <TableInsertDialog
          open={tableDialogOpen}
          onOpenChange={setTableDialogOpen}
          onInsert={handleInsertTable}
        />
        
        <LinkInsertDialog
          open={linkDialogOpen}
          onOpenChange={setLinkDialogOpen}
          onInsert={handleInsertLink}
        />

        <ConfirmDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          title="Kaydedilmemiş Değişiklikler"
          description="Belgenizde kaydedilmemiş değişiklikler var. Devam etmek istiyor musunuz? Bu işlem verilerinizi kaybedebilir."
          onConfirm={handleConfirmAction}
        />
      </div>
    </DarkModeProvider>
  );
};

export default EditorContent;
