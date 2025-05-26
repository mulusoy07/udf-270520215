
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TableInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (tableData: { rows: number; cols: number; hasHeader: boolean }) => void;
}

const TableInsertDialog: React.FC<TableInsertDialogProps> = ({
  open,
  onOpenChange,
  onInsert
}) => {
  const [rows, setRows] = useState('3');
  const [cols, setCols] = useState('3');
  const [hasHeader, setHasHeader] = useState(true);

  const handleInsert = () => {
    const rowCount = parseInt(rows);
    const colCount = parseInt(cols);
    
    if (rowCount > 0 && colCount > 0 && rowCount <= 20 && colCount <= 10) {
      onInsert({
        rows: rowCount,
        cols: colCount,
        hasHeader
      });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tablo Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="rows">Satır Sayısı</Label>
              <Input
                id="rows"
                type="number"
                min="1"
                max="20"
                value={rows}
                onChange={(e) => setRows(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="cols">Sütun Sayısı</Label>
              <Input
                id="cols"
                type="number"
                min="1"
                max="10"
                value={cols}
                onChange={(e) => setCols(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="has-header"
              checked={hasHeader}
              onChange={(e) => setHasHeader(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="has-header">Başlık satırı ekle</Label>
          </div>
          
          <div className="text-sm text-gray-600">
            Önizleme: {cols} sütun × {rows} satır {hasHeader ? '(başlık ile)' : ''}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button onClick={handleInsert}>
              Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TableInsertDialog;
