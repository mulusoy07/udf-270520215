
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { File, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface TemplateGalleryProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelect: (content: string) => void;
}

const TemplateGallery: React.FC<TemplateGalleryProps> = ({ open, onOpenChange, onTemplateSelect }) => {
  const [selectedCategory, setSelectedCategory] = useState('Hukuk');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isLargeMobile = useMediaQuery('(max-width: 900px)');

  const categories = [
    { name: 'Hukuk', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' },
    { name: 'Ticaret', color: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' },
    { name: 'Eğitim', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' },
    { name: 'Genel', color: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' },
    { name: 'İnsan Kaynakları', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' },
    { name: 'Finans', color: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' },
    { name: 'Sağlık', color: 'bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300' },
    { name: 'Teknoloji', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300' }
  ];

  const templates = {
    'Hukuk': [
      { name: 'İş Sözleşmesi', description: 'Standart iş sözleşmesi şablonu' },
      { name: 'Kira Sözleşmesi', description: 'Konut kira sözleşmesi şablonu' },
      { name: 'Vekâletname', description: 'Genel vekâletname şablonu' },
      { name: 'İcra Takip Dilekçesi', description: 'İcra takip başvuru şablonu' },
      { name: 'Boşanma Dilekçesi', description: 'Anlaşmalı boşanma dilekçesi' },
      { name: 'Miras Sözleşmesi', description: 'Miras paylaşım sözleşmesi' },
      { name: 'Satış Sözleşmesi', description: 'Taşınmaz satış sözleşmesi' },
      { name: 'İhtarname', description: 'Resmi ihtarname şablonu' },
      { name: 'Feragat Sözleşmesi', description: 'Hak feragat sözleşmesi' },
      { name: 'Uzlaşma Sözleşmesi', description: 'Arabuluculuk uzlaşma metni' }
    ],
    'Ticaret': [
      { name: 'Hizmet Sözleşmesi', description: 'B2B hizmet sözleşmesi şablonu' },
      { name: 'Tedarik Sözleşmesi', description: 'Mal tedarik sözleşmesi' },
      { name: 'Gizlilik Sözleşmesi', description: 'NDA gizlilik sözleşmesi' },
      { name: 'Bayilik Sözleşmesi', description: 'Ürün bayilik sözleşmesi' },
      { name: 'Franchise Sözleşmesi', description: 'Franchise anlaşması' },
      { name: 'Ortaklık Sözleşmesi', description: 'İş ortaklığı sözleşmesi' },
      { name: 'Distribütörlük Sözleşmesi', description: 'Distribütörlük anlaşması' },
      { name: 'İhracat Sözleşmesi', description: 'Uluslararası ihracat sözleşmesi' },
      { name: 'İthalat Sözleşmesi', description: 'İthalat alım sözleşmesi' },
      { name: 'Lisans Sözleşmesi', description: 'Fikri mülkiyet lisans sözleşmesi' }
    ],
    'Eğitim': [
      { name: 'Öğrenci Kayıt Formu', description: 'Eğitim kurumu kayıt formu' },
      { name: 'Kurs Sertifikası', description: 'Kurs tamamlama sertifikası' },
      { name: 'Eğitim Planı', description: 'Ders programı şablonu' },
      { name: 'Sınav Sonuç Belgesi', description: 'Sınav sonuç raporu' },
      { name: 'Öğretmen Değerlendirme', description: 'Öğretmen performans değerlendirmesi' },
      { name: 'Diploma Şablonu', description: 'Mezuniyet diploma şablonu' },
      { name: 'Katılım Belgesi', description: 'Etkinlik katılım belgesi' },
      { name: 'Bursluluk Başvurusu', description: 'Burs başvuru formu' },
      { name: 'Devamsızlık Raporu', description: 'Öğrenci devamsızlık raporu' },
      { name: 'Proje Ödevleri', description: 'Proje ödevi şablonu' }
    ],
    'Genel': [
      { name: 'Dilekçe', description: 'Genel dilekçe şablonu' },
      { name: 'Rapor', description: 'Standart rapor şablonu' },
      { name: 'Mektup', description: 'Resmi mektup şablonu' },
      { name: 'Beyanname', description: 'Genel beyanname şablonu' },
      { name: 'Başvuru Formu', description: 'Genel başvuru formu' },
      { name: 'İzin Talebi', description: 'İzin talep dilekçesi' },
      { name: 'Şikayet Dilekçesi', description: 'Resmi şikayet dilekçesi' },
      { name: 'Teşekkür Mektubu', description: 'Resmi teşekkür mektubu' },
      { name: 'Davet Mektubu', description: 'Etkinlik davet mektubu' },
      { name: 'Açıklama Belgesi', description: 'Durum açıklama belgesi' }
    ],
    'İnsan Kaynakları': [
      { name: 'İş İlanı', description: 'Personel alım ilanı' },
      { name: 'Özgeçmiş Şablonu', description: 'Profesyonel CV şablonu' },
      { name: 'İş Başvuru Formu', description: 'Personel başvuru formu' },
      { name: 'Performans Değerlendirme', description: 'Çalışan performans formu' },
      { name: 'İşten Çıkış Formu', description: 'Personel işten çıkış formu' },
      { name: 'Referans Mektubu', description: 'Personel referans mektubu' },
      { name: 'Maaş Bordrosu', description: 'Aylık maaş bordrosu' },
      { name: 'İzin Raporu', description: 'Personel izin raporu' },
      { name: 'Disiplin Formu', description: 'Disiplin ceza formu' },
      { name: 'Terfi Raporu', description: 'Personel terfi değerlendirmesi' }
    ],
    'Finans': [
      { name: 'Fatura', description: 'Standart fatura şablonu' },
      { name: 'Bütçe Raporu', description: 'Aylık bütçe raporu' },
      { name: 'Gider Raporu', description: 'Harcama raporu şablonu' },
      { name: 'Makbuz', description: 'Ödeme makbuzu' },
      { name: 'Kredi Başvurusu', description: 'Banka kredi başvuru formu' },
      { name: 'Finansal Analiz', description: 'Mali durum analiz raporu' },
      { name: 'Yatırım Planı', description: 'Yatırım projesi planı' },
      { name: 'Nakit Akış Raporu', description: 'Nakit akış analizi' },
      { name: 'Vergi Beyannamesi', description: 'Kurumlar vergisi beyannamesi' },
      { name: 'Muhasebe Raporu', description: 'Aylık muhasebe raporu' }
    ],
    'Sağlık': [
      { name: 'Hasta Dosyası', description: 'Hasta bilgi formu' },
      { name: 'Taburcu Raporu', description: 'Hastane taburcu raporu' },
      { name: 'Reçete', description: 'İlaç reçetesi şablonu' },
      { name: 'Tıbbi Rapor', description: 'Doktor muayene raporu' },
      { name: 'Laboratuvar Sonucu', description: 'Test sonuç raporu' },
      { name: 'Ameliyat Raporu', description: 'Cerrahi ameliyat raporu' },
      { name: 'Hasta Takip Formu', description: 'Hasta takip çizelgesi' },
      { name: 'Aşı Kartı', description: 'Aşı takip kartı' },
      { name: 'Sağlık Raporu', description: 'Genel sağlık raporu' },
      { name: 'İş Sağlığı Raporu', description: 'İş yeri sağlık raporu' }
    ],
    'Teknoloji': [
      { name: 'Proje Teklifi', description: 'Yazılım proje teklifi' },
      { name: 'Teknik Dokümantasyon', description: 'API dokümantasyonu' },
      { name: 'Test Raporu', description: 'Yazılım test raporu' },
      { name: 'Sistem Analizi', description: 'Sistem analiz raporu' },
      { name: 'Güvenlik Raporu', description: 'Siber güvenlik raporu' },
      { name: 'Performans Raporu', description: 'Sistem performans analizi' },
      { name: 'Kullanıcı Kılavuzu', description: 'Yazılım kullanım kılavuzu' },
      { name: 'Hata Raporu', description: 'Bug raporu şablonu' },
      { name: 'Proje Planı', description: 'Yazılım proje planı' },
      { name: 'Sürüm Notları', description: 'Yazılım sürüm notları' }
    ]
  };

  const filteredTemplates = templates[selectedCategory as keyof typeof templates]?.filter(template =>
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  // Mobile category navigation - responsive
  const currentCategoryIndex = categories.findIndex(cat => cat.name === selectedCategory);
  
  // Mobile category display logic - responsive
  const getMobileVisibleCategories = () => {
    const totalCategories = categories.length;
    let visibleCount = 2; // Default for very small mobile
    
    if (isLargeMobile && !isTablet) {
      visibleCount = 3; // Larger mobile devices
    } else if (isTablet && !isMobile) {
      visibleCount = 4; // Tablet devices
    } else if (!isTablet && !isMobile) {
      visibleCount = 6; // Desktop - show more categories
    }
    
    let startIndex = Math.max(0, currentCategoryIndex - Math.floor(visibleCount / 2));
    let endIndex = Math.min(totalCategories, startIndex + visibleCount);
    
    // Adjust if we're near the end
    if (endIndex - startIndex < visibleCount && endIndex === totalCategories) {
      startIndex = Math.max(0, endIndex - visibleCount);
    }
    
    return {
      categories: categories.slice(startIndex, endIndex),
      canGoPrevious: currentCategoryIndex > 0,
      canGoNext: currentCategoryIndex < totalCategories - 1
    };
  };

  const handlePreviousCategory = () => {
    if (currentCategoryIndex > 0) {
      setSelectedCategory(categories[currentCategoryIndex - 1].name);
    }
  };

  const handleNextCategory = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setSelectedCategory(categories[currentCategoryIndex + 1].name);
    }
  };

  const handleTemplateSelect = (templateName: string) => {
    const sampleContent = `
<h1 style="text-align: center; font-size: 18pt; margin-bottom: 20px;">${templateName.toUpperCase()}</h1>

<p>Bu ${templateName.toLowerCase()} şablonudur. İçeriği kendi ihtiyaçlarınıza göre düzenleyebilirsiniz.</p>

<h2>1. Giriş</h2>
<p>Bu bölümde ${templateName.toLowerCase()} ile ilgili genel bilgiler yer alır.</p>

<h2>2. Detaylar</h2>
<p>Buraya detaylı bilgiler ekleyebilirsiniz.</p>

<h2>3. Sonuç</h2>
<p>Sonuç bölümü için alan.</p>

<p style="margin-top: 40px;">Tarih: [Tarih]</p>
<p>İmza: ________________</p>
    `;

    onTemplateSelect(sampleContent);
    onOpenChange(false);
    
    toast({
      title: "Şablon Yüklendi",
      description: `${templateName} şablonu editöre yüklendi.`,
    });
  };

  // Calculate responsive template grid height and columns
  const getTemplateDisplayConfig = () => {
    if (isMobile) {
      return {
        columns: 'grid-cols-1',
        maxHeight: '50vh' // 50% of viewport height on mobile
      };
    } else if (isTablet) {
      return {
        columns: 'grid-cols-1',
        maxHeight: '60vh' // 60% of viewport height on tablet
      };
    } else {
      return {
        columns: 'grid-cols-2',
        maxHeight: '70vh' // 70% of viewport height on desktop
      };
    }
  };

  const templateConfig = getTemplateDisplayConfig();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${
        isMobile 
          ? 'w-[95vw] h-[90vh] max-w-none m-2' 
          : isTablet 
            ? 'w-[90vw] h-[85vh] max-w-none' 
            : 'sm:max-w-6xl max-h-[85vh]'
      } bg-white dark:bg-gray-800 flex flex-col border-gray-200 dark:border-gray-700`}>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-xl text-gray-900 dark:text-gray-100">Hazır Şablonlar</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-1 overflow-hidden">
          {/* Mobile Layout */}
          {isMobile ? (
            <div className="flex flex-col w-full h-full">
              {/* Categories with navigation arrows on mobile */}
              <div className="flex-shrink-0 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-sm text-gray-900 dark:text-gray-100">Kategoriler</h3>
                </div>
                
                {/* Mobile category navigation - responsive */}
                <div className="flex items-center gap-1">
                  {(() => {
                    const { categories: visibleCategories, canGoPrevious, canGoNext } = getMobileVisibleCategories();
                    
                    return (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={handlePreviousCategory}
                          disabled={!canGoPrevious}
                        >
                          <ChevronLeft size={14} className="text-gray-600 dark:text-gray-300" />
                        </Button>
                        
                        <div className="flex gap-1 flex-1 justify-center overflow-hidden">
                          {visibleCategories.map((category) => (
                            <Button
                              key={category.name}
                              variant={selectedCategory === category.name ? "default" : "outline"}
                              size="sm"
                              className={`text-xs px-2 py-2 h-8 flex-shrink-0 min-w-0 ${
                                selectedCategory === category.name 
                                  ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600' 
                                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                              }`}
                              onClick={() => setSelectedCategory(category.name)}
                              title={category.name}
                            >
                              <span className="truncate">{category.name}</span>
                            </Button>
                          ))}
                        </div>
                        
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 flex-shrink-0 hover:bg-gray-100 dark:hover:bg-gray-700"
                          onClick={handleNextCategory}
                          disabled={!canGoNext}
                        >
                          <ChevronRight size={14} className="text-gray-600 dark:text-gray-300" />
                        </Button>
                      </>
                    );
                  })()}
                </div>
              </div>
              
              {/* Search */}
              <div className="relative mb-4 flex-shrink-0">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                <Input
                  placeholder="Şablon ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-sm bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                />
              </div>
              
              {/* Templates - Responsive height */}
              <div className="flex-1 min-h-0">
                <div style={{ height: templateConfig.maxHeight }}>
                  <ScrollArea className="h-full pr-4">
                    <div className="space-y-3">
                      {filteredTemplates.map((template, index) => (
                        <div
                          key={index}
                          className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
                          onClick={() => handleTemplateSelect(template.name)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded flex-shrink-0">
                              <File size={16} className="text-blue-600 dark:text-blue-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm mb-1 text-gray-900 dark:text-gray-100">{template.name}</h4>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{template.description}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredTemplates.length === 0 && (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                          <File size={48} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                          <p className="text-sm">Aradığınız kriterlere uygun şablon bulunamadı.</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
          ) : (
            /* Desktop Layout */
            <div className="flex gap-4 h-full w-full">
              {/* Categories - Vertical on desktop */}
              <div className={`${isTablet ? 'w-1/3' : 'w-1/4'} flex-shrink-0`}>
                <h3 className="font-semibold text-sm mb-3 text-gray-900 dark:text-gray-100">Kategoriler</h3>
                <ScrollArea className="h-full">
                  <div className="space-y-2 pr-2">
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={selectedCategory === category.name ? "default" : "ghost"}
                        className={`w-full justify-start text-sm ${
                          selectedCategory === category.name 
                            ? 'bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600' 
                            : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                        }`}
                        onClick={() => setSelectedCategory(category.name)}
                      >
                        <span className={`w-3 h-3 rounded-full mr-2 ${category.color.split(' ')[0]} ${category.color.split(' ')[1]}`}></span>
                        {category.name}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
              
              {/* Templates */}
              <div className="flex-1 flex flex-col h-full">
                {/* Search */}
                <div className="relative mb-4 flex-shrink-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={16} />
                  <Input
                    placeholder="Şablon ara..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  />
                </div>
                
                {/* Template Grid - Responsive height */}
                <div className="flex-1 min-h-0">
                  <div style={{ height: templateConfig.maxHeight }}>
                    <ScrollArea className="h-full pr-4">
                      <div className="pr-4">
                        <div className={`grid gap-3 ${templateConfig.columns}`}>
                          {filteredTemplates.map((template, index) => (
                            <div
                              key={index}
                              className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer hover:border-blue-300 dark:hover:border-blue-600 bg-white dark:bg-gray-800"
                              onClick={() => handleTemplateSelect(template.name)}
                            >
                              <div className="flex items-start gap-3">
                                <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded flex-shrink-0">
                                  <File size={20} className="text-blue-600 dark:text-blue-400" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm mb-1 truncate text-gray-900 dark:text-gray-100">{template.name}</h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{template.description}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        
                        {filteredTemplates.length === 0 && (
                          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            <File size={48} className="mx-auto mb-2 text-gray-300 dark:text-gray-600" />
                            <p>Aradığınız kriterlere uygun şablon bulunamadı.</p>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGallery;
