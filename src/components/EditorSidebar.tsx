import React, { useState, useEffect } from 'react';
import { File, Folder } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileSignatureDialog from '@/components/MobileSignatureDialog';
import ESignatureDialog from '@/components/ESignatureDialog';
import TemplateGallery from '@/components/TemplateGallery';
import FileManager from '@/components/FileManager';
import LoginModal from '@/components/LoginModal';
import EditorSidebarCollapsed from './sidebar/EditorSidebarCollapsed';
import EditorSidebarContent from './sidebar/EditorSidebarContent';

interface EditorSidebarProps {
  collapsed: boolean;
  setCollapsed?: (collapsed: boolean) => void;
  onDocumentLoad?: (content: string) => void;
}

const EditorSidebar: React.FC<EditorSidebarProps> = ({ collapsed, setCollapsed, onDocumentLoad }) => {
  const [historyOpen, setHistoryOpen] = useState(false);
  const [filesOpen, setFilesOpen] = useState(false);
  const [signatureOpen, setSignatureOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [expandedFolders, setExpandedFolders] = useState<string[]>([]);
  const [mobileSignatureOpen, setMobileSignatureOpen] = useState(false);
  const [eSignatureOpen, setESignatureOpen] = useState(false);
  const [templateGalleryOpen, setTemplateGalleryOpen] = useState(false);
  const [fileManagerOpen, setFileManagerOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const { toast } = useToast();
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Reset collapsible states when sidebar is collapsed/expanded on mobile
  useEffect(() => {
    if (isMobile && collapsed) {
      setHistoryOpen(false);
      setFilesOpen(false);
      setSignatureOpen(false);
      setAccountOpen(false);
    }
  }, [isMobile, collapsed]);

  // Function to handle expanding the sidebar for mobile
  const expandSidebar = (section: string) => {
    if (setCollapsed && isMobile) {
      setCollapsed(false);
      setTimeout(() => {
        if (section === 'history') {
          setHistoryOpen(true);
          setFilesOpen(false);
          setSignatureOpen(false);
          setAccountOpen(false);
        } else if (section === 'files') {
          setHistoryOpen(false);
          setFilesOpen(true);
          setSignatureOpen(false);
          setAccountOpen(false);
        } else if (section === 'signature') {
          setHistoryOpen(false);
          setFilesOpen(false);
          setSignatureOpen(true);
          setAccountOpen(false);
        } else if (section === 'account') {
          setHistoryOpen(false);
          setFilesOpen(false);
          setSignatureOpen(false);
          setAccountOpen(true);
        }
      }, 150);
    }
  };

  // Document templates for testing
  const documentTemplates = {
    'Belge_1.udf': `
<h1 style="text-align: center; font-size: 18pt; margin-bottom: 20px;">İŞ SÖZLEŞMESİ</h1>

<p><strong>İşveren:</strong> ABC Şirketi A.Ş.</p>
<p><strong>Adres:</strong> İstanbul, Türkiye</p>
<p><strong>Vergi No:</strong> 1234567890</p>

<p><strong>İşçi:</strong> [İsim Soyisim]</p>
<p><strong>T.C. Kimlik No:</strong> [Kimlik Numarası]</p>
<p><strong>Adres:</strong> [Adres Bilgisi]</p>

<h2>Madde 1 - İşin Konusu</h2>
<p>İşçi, yazılım geliştirme pozisyonunda çalışacaktır.</p>

<h2>Madde 2 - Çalışma Süresi</h2>
<p>Haftalık çalışma süresi 40 saat olup, günlük 8 saat çalışılacaktır.</p>

<h2>Madde 3 - Ücret</h2>
<p>Aylık brüt ücret [Ücret Miktarı] TL'dir.</p>

<p style="margin-top: 40px;">Tarih: [Tarih]</p>
<p>İşveren İmzası: ________________</p>
<p>İşçi İmzası: ________________</p>
    `,
    'Sözleşme_2023.udf': `
<h1 style="text-align: center; font-size: 18pt; margin-bottom: 20px;">HİZMET SÖZLEŞMESİ</h1>

<p><strong>Hizmet Veren:</strong> XYZ Danışmanlık Ltd. Şti.</p>
<p><strong>Vergi Dairesi:</strong> Kadıköy Vergi Dairesi</p>
<p><strong>Vergi No:</strong> 9876543210</p>

<p><strong>Hizmet Alan:</strong> DEF Teknoloji A.Ş.</p>
<p><strong>Vergi No:</strong> 1122334455</p>

<h2>1. SÖZLEŞMENİN KONUSU</h2>
<p>Bu sözleşme kapsamında danışmanlık hizmetleri verilecektir.</p>

<h2>2. SÖZLEŞME SÜRESİ</h2>
<p>Sözleşme süresi 12 ay olup, [Başlangıç Tarihi] tarihinde başlayacaktır.</p>

<h2>3. ÖDEME KOŞULLARI</h2>
<p>Aylık hizmet bedeli [Tutar] TL + KDV'dir.</p>

<h2>4. SORUMLULUKAR</h2>
<p>Tarafların yükümlülükleri ve sorumlulukları bu maddede belirtilmiştir.</p>

<p style="margin-top: 40px;">Bu sözleşme [Tarih] tarihinde imzalanmıştır.</p>
<table style="width: 100%; margin-top: 30px;">
<tr>
<td style="width: 50%; text-align: center;">Hizmet Veren<br>________________</td>
<td style="width: 50%; text-align: center;">Hizmet Alan<br>________________</td>
</tr>
</table>
    `,
    'Rapor_Mayıs.udf': `
<h1 style="text-align: center; font-size: 18pt; margin-bottom: 20px;">AYLIK FAALİYET RAPORU</h1>
<h2 style="text-align: center; font-size: 14pt; margin-bottom: 30px;">Mayıs 2024</h2>

<h2>1. GENEL BİLGİLER</h2>
<p><strong>Rapor Dönemi:</strong> 01-31 Mayıs 2024</p>
<p><strong>Hazırlayan:</strong> [İsim Soyisim]</p>
<p><strong>Departman:</strong> Bilgi İşlem</p>

<h2>2. GERÇEKLEŞTİRİLEN FAALİYETLER</h2>
<ul>
<li>Sistem güncellemeleri yapıldı</li>
<li>Yeni kullanıcı hesapları oluşturuldu</li>
<li>Güvenlik taramaları gerçekleştirildi</li>
<li>Backup işlemleri kontrol edildi</li>
</ul>

<h2>3. İSTATİSTİKLER</h2>
<table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<tr style="background-color: #f0f0f0;">
<th style="padding: 8px;">Metrik</th>
<th style="padding: 8px;">Değer</th>
</tr>
<tr>
<td style="padding: 8px;">Toplam Kullanıcı Sayısı</td>
<td style="padding: 8px;">245</td>
</tr>
<tr>
<td style="padding: 8px;">Yeni Kayıtlar</td>
<td style="padding: 8px;">23</td>
</tr>
<tr>
<td style="padding: 8px;">Sistem Çalışma Oranı</td>
<td style="padding: 8px;">%99.2</td>
</tr>
</table>

<h2>4. ÖNERİLER</h2>
<p>• Sunucu kapasitesinin artırılması önerilmektedir.</p>
<p>• Yedekleme sisteminin güncellenmesi gerekmektedir.</p>

<p style="margin-top: 40px;"><strong>Rapor Tarihi:</strong> [Tarih]</p>
<p><strong>Hazırlayan:</strong> ________________</p>
    `,
    'Personel_Listesi.udf': `
<h1 style="text-align: center; font-size: 18pt; margin-bottom: 20px;">PERSONEL LİSTESİ</h1>
<h2 style="text-align: center; font-size: 14pt; margin-bottom: 30px;">Mayıs 2024 Güncel Liste</h2>

<h2>BİLGİ İŞLEM DEPARTMANI</h2>
<table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<tr style="background-color: #e6f3ff;">
<th style="padding: 10px;">Sicil No</th>
<th style="padding: 10px;">Ad Soyad</th>
<th style="padding: 10px;">Pozisyon</th>
<th style="padding: 10px;">Giriş Tarihi</th>
</tr>
<tr>
<td style="padding: 8px;">001</td>
<td style="padding: 8px;">Ahmet Yılmaz</td>
<td style="padding: 8px;">Yazılım Geliştirici</td>
<td style="padding: 8px;">15.03.2023</td>
</tr>
<tr>
<td style="padding: 8px;">002</td>
<td style="padding: 8px;">Ayşe Demir</td>
<td style="padding: 8px;">Sistem Yöneticisi</td>
<td style="padding: 8px;">22.01.2022</td>
</tr>
<tr>
<td style="padding: 8px;">003</td>
<td style="padding: 8px;">Mehmet Kaya</td>
<td style="padding: 8px;">Veritabanı Uzmanı</td>
<td style="padding: 8px;">10.09.2023</td>
</tr>
</table>

<h2>MUHASEBE DEPARTMANI</h2>
<table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<tr style="background-color: #fff2e6;">
<th style="padding: 10px;">Sicil No</th>
<th style="padding: 10px;">Ad Soyad</th>
<th style="padding: 10px;">Pozisyon</th>
<th style="padding: 10px;">Giriş Tarihi</th>
</tr>
<tr>
<td style="padding: 8px;">101</td>
<td style="padding: 8px;">Fatma Özkan</td>
<td style="padding: 8px;">Mali Müşavir</td>
<td style="padding: 8px;">05.06.2021</td>
</tr>
<tr>
<td style="padding: 8px;">102</td>
<td style="padding: 8px;">Ali Şahin</td>
<td style="padding: 8px;">Muhasebeci</td>
<td style="padding: 8px;">12.11.2022</td>
</tr>
</table>

<h2>İNSAN KAYNAKLARI</h2>
<table border="1" style="width: 100%; border-collapse: collapse; margin: 20px 0;">
<tr style="background-color: #f0f8f0;">
<th style="padding: 10px;">Sicil No</th>
<th style="padding: 10px;">Ad Soyad</th>
<th style="padding: 10px;">Pozisyon</th>
<th style="padding: 10px;">Giriş Tarihi</th>
</tr>
<tr>
<td style="padding: 8px;">201</td>
<td style="padding: 8px;">Zehra Güven</td>
<td style="padding: 8px;">İK Uzmanı</td>
<td style="padding: 8px;">18.04.2023</td>
</tr>
</table>

<p style="margin-top: 40px;"><strong>Toplam Personel Sayısı:</strong> 6</p>
<p><strong>Liste Güncellenme Tarihi:</strong> [Tarih]</p>
<p><strong>Hazırlayan:</strong> İnsan Kaynakları Departmanı</p>
    `
  };

  const recentDocs = [
    { name: 'Belge_1.udf', date: '15 Mayıs 2025', icon: File },
    { name: 'Sözleşme_2023.udf', date: '14 Mayıs 2025', icon: File },
    { name: 'Rapor_Mayıs.udf', date: '12 Mayıs 2025', icon: File },
    { name: 'Personel_Listesi.udf', date: '10 Mayıs 2025', icon: File },
  ];

  const fileTree = [
    { 
      name: 'Projeler', 
      type: 'folder', 
      icon: Folder,
      children: [
        { name: 'proje_1.udf', type: 'file', icon: File },
        { name: 'proje_2.udf', type: 'file', icon: File }
      ]
    },
    { 
      name: 'Sözleşmeler', 
      type: 'folder', 
      icon: Folder,
      children: [
        { name: 'sozlesme_2023.udf', type: 'file', icon: File }
      ]
    },
    { 
      name: 'Raporlar', 
      type: 'folder', 
      icon: Folder,
      children: [
        { name: 'rapor_mayis.udf', type: 'file', icon: File },
        { name: 'rapor_nisan.udf', type: 'file', icon: File }
      ]
    },
    { name: 'belge_2023.udf', type: 'file', icon: File },
    { name: 'analiz_raporu.udf', type: 'file', icon: File },
  ];

  const toggleFolder = (folderName: string) => {
    setExpandedFolders(prev => 
      prev.includes(folderName) 
        ? prev.filter(name => name !== folderName)
        : [...prev, folderName]
    );
  };

  const handleFileAction = (action: string, fileName: string) => {
    toast({
      title: "İşlem Tamamlandı",
      description: `${fileName} dosyası için ${action} işlemi gerçekleştirildi.`,
    });
  };

  const handleDocumentClick = (fileName: string) => {
    console.log('Opening document:', fileName);
    
    const templateContent = documentTemplates[fileName as keyof typeof documentTemplates];
    if (templateContent && onDocumentLoad) {
      onDocumentLoad(templateContent);
      toast({
        title: "Belge Açıldı",
        description: `${fileName} editöre yüklendi.`,
      });
    } else {
      const defaultContent = `<h1>Belge: ${fileName}</h1><p>Bu belgenin içeriği yükleniyor...</p>`;
      if (onDocumentLoad) {
        onDocumentLoad(defaultContent);
      }
      toast({
        title: "Belge Açıldı",
        description: `${fileName} editöre yüklendi.`,
      });
    }
  };

  const handleFileClick = (fileName: string) => {
    console.log('Opening file:', fileName);
    toast({
      title: "Dosya Açıldı",
      description: `${fileName} dosyası açıldı.`,
    });
  };

  if (collapsed) {
    return <EditorSidebarCollapsed expandSidebar={expandSidebar} />;
  }

  return (
    <>
      <EditorSidebarContent
        historyOpen={historyOpen}
        setHistoryOpen={setHistoryOpen}
        filesOpen={filesOpen}
        setFilesOpen={setFilesOpen}
        signatureOpen={signatureOpen}
        setSignatureOpen={setSignatureOpen}
        accountOpen={accountOpen}
        setAccountOpen={setAccountOpen}
        expandedFolders={expandedFolders}
        onToggleFolder={toggleFolder}
        onDocumentClick={handleDocumentClick}
        onFileClick={handleFileClick}
        onFileAction={handleFileAction}
        setMobileSignatureOpen={setMobileSignatureOpen}
        setESignatureOpen={setESignatureOpen}
        setTemplateGalleryOpen={setTemplateGalleryOpen}
        setFileManagerOpen={setFileManagerOpen}
        setLoginModalOpen={setLoginModalOpen}
        recentDocs={recentDocs}
      />
      
      {/* Dialog'lar */}
      <MobileSignatureDialog open={mobileSignatureOpen} onOpenChange={setMobileSignatureOpen} />
      <ESignatureDialog open={eSignatureOpen} onOpenChange={setESignatureOpen} />
      <TemplateGallery 
        open={templateGalleryOpen} 
        onOpenChange={setTemplateGalleryOpen}
        onTemplateSelect={onDocumentLoad || (() => {})}
      />
      <FileManager open={fileManagerOpen} onOpenChange={setFileManagerOpen} />
      <LoginModal open={loginModalOpen} onOpenChange={setLoginModalOpen} />
    </>
  );
};

export default EditorSidebar;
