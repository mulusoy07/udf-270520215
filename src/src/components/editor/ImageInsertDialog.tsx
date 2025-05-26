
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageInsertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInsert: (imageData: { src: string; alt: string; width?: string; height?: string }) => void;
}

const ImageInsertDialog: React.FC<ImageInsertDialogProps> = ({
  open,
  onOpenChange,
  onInsert
}) => {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageUrl(e.target?.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleInsert = () => {
    if (imageUrl) {
      onInsert({
        src: imageUrl,
        alt: altText,
        width: width || undefined,
        height: height || undefined
      });
      // Reset form
      setImageUrl('');
      setAltText('');
      setWidth('');
      setHeight('');
      setFile(null);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Resim Ekle</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="file-upload">Dosya Seç</Label>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="image-url">Veya URL Girin</Label>
            <Input
              id="image-url"
              type="url"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="alt-text">Alt Metin</Label>
            <Input
              id="alt-text"
              placeholder="Resim açıklaması"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor="width">Genişlik (px)</Label>
              <Input
                id="width"
                placeholder="300"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="height">Yükseklik (px)</Label>
              <Input
                id="height"
                placeholder="200"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button onClick={handleInsert} disabled={!imageUrl}>
              Ekle
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageInsertDialog;
