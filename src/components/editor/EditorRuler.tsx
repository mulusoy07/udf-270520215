
import React, { useRef, useCallback } from 'react';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface EditorRulerProps {
  showRuler: boolean;
  leftMarker: number;
  rightMarker: number;
  rulerPosition: number;
  isDraggingLeft: boolean;
  isDraggingRight: boolean;
  onLeftMarkerDrag: (dragging: boolean) => void;
  onRightMarkerDrag: (dragging: boolean) => void;
  onLeftMarkerMove: (position: number) => void;
  onRightMarkerMove: (position: number) => void;
  a4Width: string;
  a4WidthPx: number;
}

const EditorRuler: React.FC<EditorRulerProps> = ({
  showRuler, leftMarker, rightMarker, rulerPosition, isDraggingLeft, isDraggingRight,
  onLeftMarkerDrag, onRightMarkerDrag, onLeftMarkerMove, onRightMarkerMove, a4Width, a4WidthPx
}) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const rulerRef = useRef<HTMLDivElement>(null);

  if (!showRuler) return null;

  // A4 width constraints: 0cm to 21cm
  const minPosition = 0; // 0cm - start limit
  const maxPosition = a4WidthPx; // 21cm - end limit
  const cmToPx = a4WidthPx / 21; // pixels per centimeter

  // Cursor 1 (Left marker) constraints - cannot go beyond right marker or limits
  const cursor1MaxPosition = Math.min(rightMarker - 12, maxPosition - 12); // 12px minimum gap, cannot exceed right limit
  const constrainedLeftMarker = Math.max(minPosition, Math.min(cursor1MaxPosition, leftMarker));

  // Cursor 2 (Right marker) constraints - cannot go beyond left marker or limits  
  const cursor2MinPosition = Math.max(leftMarker + 12, minPosition + 12); // 12px minimum gap, cannot be before left limit
  const cursor2MaxPosition = maxPosition - 12; // Cannot exceed right limit
  const constrainedRightMarker = Math.max(cursor2MinPosition, Math.min(cursor2MaxPosition, rightMarker));

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!rulerRef.current || (!isDraggingLeft && !isDraggingRight)) return;
    
    const rect = rulerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    
    if (isDraggingLeft) {
      // Cursor 1 (Sol) constraints - cannot exceed right marker or right limit
      const maxAllowed = Math.min(rightMarker - 12, maxPosition - 12);
      const constrainedX = Math.max(minPosition, Math.min(maxAllowed, x));
      onLeftMarkerMove(constrainedX);
    }
    
    if (isDraggingRight) {
      // Cursor 2 (Sağ) constraints - cannot exceed left marker or right limit
      const minAllowed = Math.max(leftMarker + 12, minPosition + 12);
      const maxAllowed = maxPosition - 12;
      const constrainedX = Math.max(minAllowed, Math.min(maxAllowed, x));
      onRightMarkerMove(constrainedX);
    }
  }, [isDraggingLeft, isDraggingRight, leftMarker, rightMarker, minPosition, maxPosition, onLeftMarkerMove, onRightMarkerMove]);

  const handleMouseUp = useCallback(() => {
    if (isDraggingLeft) onLeftMarkerDrag(false);
    if (isDraggingRight) onRightMarkerDrag(false);
  }, [isDraggingLeft, isDraggingRight, onLeftMarkerDrag, onRightMarkerDrag]);

  // Add event listeners for dragging
  React.useEffect(() => {
    if (isDraggingLeft || isDraggingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchmove', handleMouseMove as any);
      document.addEventListener('touchend', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleMouseMove as any);
        document.removeEventListener('touchend', handleMouseUp);
      };
    }
  }, [isDraggingLeft, isDraggingRight, handleMouseMove, handleMouseUp]);

  return (
    <div 
      className="w-full bg-gray-50 dark:bg-gray-800"
      style={{
        borderStyle: 'solid',
        borderColor: 'hsl(var(--border))',
        borderBottomWidth: '1px'
      }}
    >
      <div className="flex justify-center">
        <div 
          ref={rulerRef}
          className="relative h-8 bg-gray-50 dark:bg-gray-800 overflow-x-auto touch-pan-x"
          style={{ 
            width: isMobile ? '100%' : a4Width,
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none'
          }}
        >
          <style>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div className="absolute top-0 left-0 h-8 flex items-end" style={{ minWidth: `${a4WidthPx}px` }}>
            {/* Start limit line (0cm) - Blue line */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-blue-500 dark:bg-blue-400 z-10" 
              style={{ 
                left: `${minPosition}px`,
              }}
            />
            
            {/* End limit line (21cm) - Blue line */}
            <div 
              className="absolute top-0 bottom-0 w-px bg-blue-500 dark:bg-blue-400 z-10" 
              style={{ 
                left: `${maxPosition - 1}px`, // Subtract 1px to account for line width
              }}
            />
            
            {/* Ruler ticks - 0 to 21cm with numbers 0-21 */}
            {Array.from({ length: 22 }).map((_, i) => (
              <div key={i}>
                <div 
                  className={`border-l border-gray-500 dark:border-gray-400 h-3`} 
                  style={{ 
                    position: 'absolute', 
                    left: `${i * cmToPx}px`,
                    bottom: 0,
                    width: '1px',
                  }}
                />
                
                {/* Numbers 0-21 */}
                <div 
                  className="absolute text-xs text-gray-600 dark:text-gray-300"
                  style={{ 
                    left: `${i * cmToPx - 4}px`,
                    bottom: '14px',
                    fontSize: '10px',
                  }}
                >
                  {i}
                </div>
                
                {/* Small ticks between numbers (0.1cm increments) */}
                {i < 21 && Array.from({ length: 9 }).map((_, j) => (
                  <div 
                    key={`${i}-${j}`} 
                    className="border-l border-gray-300 dark:border-gray-500"
                    style={{ 
                      position: 'absolute', 
                      left: `${i * cmToPx + (j + 1) * (cmToPx / 10)}px`,
                      bottom: 0,
                      height: j === 4 ? '8px' : '4px', // 0.5cm marks are taller
                      width: '1px',
                    }}
                  />
                ))}
              </div>
            ))}
          </div>
          
          {/* Cursor 1 (Sol kenar boşluğu) - Left margin marker */}
          <div 
            className={`absolute top-0 bottom-0 w-3 bg-blue-500 dark:bg-blue-400 z-20 cursor-ew-resize hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors ${
              isDraggingLeft ? 'bg-blue-600 dark:bg-blue-500' : ''
            }`}
            style={{ 
              left: `${constrainedLeftMarker}px`,
              borderRadius: '2px'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              onLeftMarkerDrag(true);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              onLeftMarkerDrag(true);
            }}
            title={`Cursor 1 - Sol kenar boşluğu (${(constrainedLeftMarker / cmToPx).toFixed(1)}cm)`}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-white opacity-70 rounded-full" />
            {/* Cursor number indicator */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 dark:text-blue-400">1</div>
          </div>
          
          {/* Cursor 2 (Sağ kenar boşluğu) - Right margin marker */}
          <div 
            className={`absolute top-0 bottom-0 w-3 bg-blue-500 dark:bg-blue-400 z-20 cursor-ew-resize hover:bg-blue-600 dark:hover:bg-blue-500 transition-colors ${
              isDraggingRight ? 'bg-blue-600 dark:bg-blue-500' : ''
            }`}
            style={{ 
              left: `${constrainedRightMarker}px`,
              borderRadius: '2px'
            }}
            onMouseDown={(e) => {
              e.preventDefault();
              onRightMarkerDrag(true);
            }}
            onTouchStart={(e) => {
              e.preventDefault();
              onRightMarkerDrag(true);
            }}
            title={`Cursor 2 - Sağ kenar boşluğu (${(constrainedRightMarker / cmToPx).toFixed(1)}cm)`}
          >
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1 h-4 bg-white opacity-70 rounded-full" />
            {/* Cursor number indicator */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-xs font-bold text-blue-600 dark:text-blue-400">2</div>
          </div>
          
          {/* Ruler position indicator */}
          <div 
            className="absolute top-0 bottom-0 w-px bg-blue-600 dark:bg-blue-400 z-10" 
            style={{ left: `${Math.max(minPosition, Math.min(maxPosition, rulerPosition))}px` }}
          />
        </div>
      </div>
    </div>
  );
};

export default EditorRuler;
