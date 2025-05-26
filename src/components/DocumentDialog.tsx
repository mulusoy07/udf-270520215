import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Plus, FolderOpen, History, Upload, File, LayoutTemplate } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import TemplateGallery from './TemplateGallery';

interface DocumentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DocumentDialog: React.FC<DocumentDialogProps> = ({ open, onOpenChange }) => {
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState('blank');
  const [isDragOver, setIsDragOver] = useState(false);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  // Auto-open template gallery when template option is selected
  useEffect(() => {
    if (docType === 'template') {
      setTemplateGalleryOpen(true);
    }
  }, [docType]);

  const recentDocs = [
    { name: 'Belge_1.udf', date: '15 Mayıs 2025', size: '24 KB' },
    { name: 'Sözleşme_2023.udf', date: '14 Mayıs 2025', size: '156 KB' },
    { name: 'Rapor_Mayıs.udf', date: '12 Mayıs 2025', size: '89 KB' },
    { name: 'Personel_Listesi.udf', date: '10 Mayıs 2025', size: '67 KB' },
    { name: 'Analiz_Raporu.udf', date: '8 Mayıs 2025', size: '234 KB' },
    { name: 'Proje_Sunumu.udf', date: '6 Mayıs 2025', size: '445 KB' },
    { name: 'Bütçe_2025.udf', date: '4 Mayıs 2025', size: '178 KB' },
    { name: 'Toplantı_Notları.udf', date: '2 Mayıs 2025', size: '45 KB' },
    { name: 'İnsan_Kaynakları.udf', date: '30 Nisan 2025', size: '123 KB' },
    { name: 'Satış_Raporu.udf', date: '28 Nisan 2025', size: '267 KB' },
  ];

  const handleCreateDocument = () => {
    if (!docName.trim()) {
      toast({
        title: "Hata",
        description: "Lütfen belge adını giriniz.",
        variant: "destructive",
      });
      return;
    }

    if (docType === 'template') {
      setTemplateGalleryOpen(true);
      return;
    }

    console.log('Creating document:', { name: docName, type: docType });
    toast({
      title: "Belge Oluşturuldu",
      description: `${docName} belgesi başarıyla oluşturuldu.`,
    });
    
    setDocName('');
    onOpenChange(false);
  };

  const handleFileSelect = (files: FileList | null) => {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.name.endsWith('.udf')) {
        console.log('Opening file:', file.name);
        toast({
          title: "Dosya Açıldı",
          description: `${file.name} dosyası başarıyla açıldı.`,
        });
        onOpenChange(false);
      } else {
        toast({
          title: "Hata",
          description: "Lütfen geçerli bir UDF dosyası seçiniz.",
          variant: "destructive",
        });
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDocumentSelect = (docName: string) => {
    console.log('Opening recent document:', docName);
    toast({
      title: "Belge Açıldı",
      description: `${docName} belgesi başarıyla açıldı.`,
    });
    onOpenChange(false);
  };

  const handleTemplateSelect = (content: string) => {
    setTemplateGalleryOpen(false);
    onOpenChange(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg w-full max-w-[95vw] mx-auto">
          <DialogHeader>
            <DialogTitle>UDF Belge İşlemleri</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="create" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="create" className="text-xs sm:text-sm">
                <Plus size={16} className="mr-1 sm:mr-2" />
                <span>Belge Oluştur</span>
              </TabsTrigger>
              <TabsTrigger value="open" className="text-xs sm:text-sm">
                <FolderOpen size={16} className="mr-1 sm:mr-2" />
                <span>Belge Aç</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-xs sm:text-sm">
                <History size={16} className="mr-1 sm:mr-2" />
                <span>Geçmiş</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="space-y-4 mt-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="docName">Belge Adı</Label>
                  <Input
                    id="docName"
                    placeholder="Yeni belge adını giriniz"
                    value={docName}
                    onChange={(e) => setDocName(e.target.value)}
                    className="mt-1"
                  />
                </div>
                
                <div>
                  <Label>Belge Türü</Label>
                  <RadioGroup value={docType} onValueChange={setDocType} className="mt-3">
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="blank" id="blank" />
                      <Label htmlFor="blank" className="flex items-center cursor-pointer flex-1">
                        <File size={18} className="mr-2 text-blue-600" />
                        <div>
                          <div className="font-medium">Boş Belge</div>
                          <div className="text-sm text-gray-500">Boş bir belge ile başlayın</div>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                      <RadioGroupItem value="template" id="template" />
                      <Label htmlFor="template" className="flex items-center cursor-pointer flex-1">
                        <LayoutTemplate size={18} className="mr-2 text-green-600" />
                        <div>
                          <div className="font-medium">Şablondan Oluştur</div>
                          <div className="text-sm text-gray-500">Hazır şablonlardan birini seçin</div>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <Button onClick={handleCreateDocument} className="w-full">
                  <Plus size={16} className="mr-2" />
                  Belge Oluştur
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="open" className="space-y-4">
              <div className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Bilgisayardan bir UDF belge seçin veya buraya sürükleyin
                  </p>
                  
                  <div
                    className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      isDragOver ? 'border-blue-400 bg-blue-50' : 'border-gray-300'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    <Upload size={48} className="mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-500 mb-4">
                      UDF dosyalarını buraya sürükleyin
                    </p>
                  </div>
                  
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full mt-4"
                  >
                    <FolderOpen size={16} className="mr-2" />
                    Dosya Seç
                  </Button>
                  
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".udf"
                    onChange={(e) => handleFileSelect(e.target.files)}
                    className="hidden"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="recent" className="space-y-4">
              <div>
                <Label>Son Belgeler</Label>
                <ScrollArea className="h-64 mt-2">
                  <div className="space-y-2 pr-4">
                    {recentDocs.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleDocumentSelect(doc.name)}
                      >
                        <div className="flex items-center space-x-3">
                          <File size={20} className="text-blue-600" />
                          <div>
                            <p className="font-medium text-sm">{doc.name}</p>
                            <p className="text-xs text-gray-500">{doc.date} • {doc.size}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      <TemplateGallery 
        open={templateGalleryOpen}
        onOpenChange={setTemplateGalleryOpen}
        onTemplateSelect={handleTemplateSelect}
      />
    </>
  );
};

export default DocumentDialog;
