
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinkInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (linkData: { url: string; text: string; target?: string }) => void;
}

const LinkInsertDialog: React.FC<LinkInsertDialogProps> = ({
  open,
  onOpenChange,
  onInsert
}) => {
  const [url, setUrl] = useState('');
  const [text, setText] = useState('');
  const [openInNewTab, setOpenInNewTab] = useState(true);

  const handleInsert = () => {
    if (url && text) {
      onInsert({
        url,
        text,
        target: openInNewTab ? '_blank' : undefined
      });
      // Reset form
      setUrl('');
      setText('');
      setOpenInNewTab(true);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Bağlantı Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="link-url">URL</Label>
            <Input
              id="link-url"
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="link-text">Görüntülenecek Metin</Label>
            <Input
              id="link-text"
              placeholder="Bağlantı metni"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="new-tab"
              checked={openInNewTab}
              onChange={(e) => setOpenInNewTab(e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="new-tab">Yeni sekmede aç</Label>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button onClick={handleInsert} disabled={!url || !text}>
              Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LinkInsertDialog;
