
export interface DocumentTemplate {
  id: string;
  title: string;
  content: string;
  type: 'letter' | 'report' | 'memo' | 'contract';
}

export const documentTemplates: DocumentTemplate[] = [
  {
    id: '1',
    title: 'Resmi Mektup',
    type: 'letter',
    content: `
      <div style="text-align: right; margin-bottom: 20px;">
        <strong>Ankara Üniversitesi</strong><br>
        Hukuk Fakültesi<br>
        06100 Sıhhiye/ANKARA<br>
        Tel: (0312) 310 15 15<br>
        E-posta: info@ankara.edu.tr
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong>Tarih:</strong> ${new Date().toLocaleDateString('tr-TR')}<br>
        <strong>Sayı:</strong> 2024/001<br>
        <strong>Konu:</strong> Başvuru Sonucu Hakkında
      </div>
      
      <div style="margin-bottom: 20px;">
        <strong>Sayın [İsim Soyisim],</strong>
      </div>
      
      <p style="text-align: justify; line-height: 1.6;">
        Üniversitemiz Hukuk Fakültesi'ne yapmış olduğunuz başvuru ile ilgili olarak, gerekli değerlendirmeler yapılmış ve başvurunuzun uygun görüldüğü takdirde size bilgi verilecektir.
      </p>
      
      <p style="text-align: justify; line-height: 1.6;">
        Bu konuda herhangi bir sorunuz olması halinde, fakültemiz sekreterliği ile iletişime geçebilirsiniz.
      </p>
      
      <div style="margin-top: 40px;">
        <p><strong>Saygılarımızla,</strong></p>
        <br><br>
        <p>
          <strong>Prof. Dr. [İsim Soyisim]</strong><br>
          Hukuk Fakültesi Dekanı
        </p>
      </div>
    `
  },
  {
    id: '2',
    title: 'Proje Raporu',
    type: 'report',
    content: `
      <div style="text-align: center; margin-bottom: 40px;">
        <h1 style="font-size: 18pt; font-weight: bold; margin: 0;">PROJE RAPORU</h1>
        <h2 style="font-size: 14pt; margin: 10px 0;">Dijital Dönüşüm Projesi</h2>
        <p style="margin: 20px 0;">Hazırlayan: Proje Ekibi<br>Tarih: ${new Date().toLocaleDateString('tr-TR')}</p>
      </div>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">1. ÖZET</h3>
      <p style="text-align: justify; line-height: 1.6;">
        Bu rapor, şirketimizin dijital dönüşüm projesi kapsamında gerçekleştirilen çalışmaların sonuçlarını ve gelecek planlarını içermektedir. Proje 6 ay süresince devam etmiş ve başarılı bir şekilde tamamlanmıştır.
      </p>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">2. PROJE HEDEFLERI</h3>
      <ul style="line-height: 1.6;">
        <li>Mevcut sistemlerin modernizasyonu</li>
        <li>Çalışan verimliliğinin artırılması</li>
        <li>Müşteri memnuniyetinin iyileştirilmesi</li>
        <li>Operasyonel maliyetlerin azaltılması</li>
      </ul>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">3. UYGULANAN ÇÖZÜMLER</h3>
      <p style="text-align: justify; line-height: 1.6;">
        Proje kapsamında bulut tabanlı çözümler implemente edilmiş, tüm departmanlar için özel yazılımlar geliştirilmiş ve personel eğitimleri düzenlenmiştir.
      </p>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">4. SONUÇLAR VE ÖNERİLER</h3>
      <p style="text-align: justify; line-height: 1.6;">
        Proje sonucunda %25 verimlilik artışı sağlanmış, müşteri memnuniyet oranı %40 artmıştır. Gelecek dönem için yeni modüllerin eklenmesi önerilmektedir.
      </p>
    `
  },
  {
    id: '3',
    title: 'Kurum İçi Memo',
    type: 'memo',
    content: `
      <div style="border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px;">
        <h1 style="font-size: 16pt; font-weight: bold; margin: 0;">KURUM İÇİ MEMO</h1>
      </div>
      
      <table style="width: 100%; margin-bottom: 20px; border-collapse: collapse;">
        <tr>
          <td style="font-weight: bold; width: 80px; padding: 5px 0;"><strong>Tarih:</strong></td>
          <td style="padding: 5px 0;">${new Date().toLocaleDateString('tr-TR')}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px 0;"><strong>Kime:</strong></td>
          <td style="padding: 5px 0;">Tüm Personel</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px 0;"><strong>Kimden:</strong></td>
          <td style="padding: 5px 0;">İnsan Kaynakları Departmanı</td>
        </tr>
        <tr>
          <td style="font-weight: bold; padding: 5px 0;"><strong>Konu:</strong></td>
          <td style="padding: 5px 0;">Yeni Çalışma Saatleri ve Uzaktan Çalışma Politikası</td>
        </tr>
      </table>
      
      <div style="line-height: 1.6;">
        <p style="text-align: justify;">
          <strong>Değerli Çalışanlarımız,</strong>
        </p>
        
        <p style="text-align: justify;">
          1 Ocak 2024 tarihinden itibaren geçerli olmak üzere yeni çalışma saatleri ve uzaktan çalışma politikamız aşağıdaki şekilde düzenlenmiştir:
        </p>
        
        <h4 style="font-weight: bold; margin: 15px 0 5px 0;">Yeni Çalışma Saatleri:</h4>
        <ul>
          <li>Pazartesi - Cuma: 09:00 - 18:00</li>
          <li>Öğle arası: 12:00 - 13:00</li>
          <li>Cuma günleri: 09:00 - 17:00</li>
        </ul>
        
        <h4 style="font-weight: bold; margin: 15px 0 5px 0;">Uzaktan Çalışma:</h4>
        <ul>
          <li>Haftada maksimum 2 gün uzaktan çalışma hakkı</li>
          <li>Önceden departman yöneticisinden onay alınması zorunlu</li>
          <li>Toplantı günlerinde ofiste bulunma şartı</li>
        </ul>
        
        <p style="text-align: justify; margin-top: 20px;">
          Herhangi bir sorunuz olması durumunda İK departmanı ile iletişime geçebilirsiniz.
        </p>
        
        <p style="margin-top: 30px;">
          <strong>İyi çalışmalar dileriz.</strong>
        </p>
      </div>
    `
  },
  {
    id: '4',
    title: 'Hizmet Sözleşmesi',
    type: 'contract',
    content: `
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="font-size: 16pt; font-weight: bold; margin: 0;">HİZMET SÖZLEŞMESİ</h1>
      </div>
      
      <p style="text-align: justify; line-height: 1.6;">
        Bu sözleşme ${new Date().toLocaleDateString('tr-TR')} tarihinde aşağıda kimlik bilgileri bulunan taraflar arasında imzalanmıştır.
      </p>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">TARAFLAR</h3>
      
      <p style="line-height: 1.6;">
        <strong>İŞVEREN:</strong><br>
        Adı Soyadı/Unvanı: [Şirket Adı]<br>
        Adresi: [Tam Adres]<br>
        Vergi Dairesi/No: [Vergi Bilgileri]<br>
        Telefon: [Telefon Numarası]<br>
        E-posta: [E-posta Adresi]
      </p>
      
      <p style="line-height: 1.6; margin-top: 15px;">
        <strong>HİZMET SAĞLAYICI:</strong><br>
        Adı Soyadı: [Tam Adı]<br>
        TC Kimlik No: [TC No]<br>
        Adresi: [Tam Adres]<br>
        Telefon: [Telefon Numarası]<br>
        E-posta: [E-posta Adresi]
      </p>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">MADDE 1 - SÖZLEŞMENİN KONUSU</h3>
      <p style="text-align: justify; line-height: 1.6;">
        Bu sözleşmenin konusu, hizmet sağlayıcının işveren adına [hizmet türü] hizmeti vermesidir. Hizmetin detayları ve kapsamı ek protokollerle belirlenecektir.
      </p>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">MADDE 2 - SÖZLEŞMENİN SÜRESİ</h3>
      <p style="text-align: justify; line-height: 1.6;">
        Bu sözleşme ${new Date().toLocaleDateString('tr-TR')} tarihinde başlayıp 1 (bir) yıl süreyle geçerlidir. Taraflardan herhangi birinin 30 gün önceden yazılı bildirimde bulunması halinde sözleşme feshedilebilir.
      </p>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">MADDE 3 - ÜCRET VE ÖDEME</h3>
      <p style="text-align: justify; line-height: 1.6;">
        Hizmet bedeli aylık [Miktar] TL olarak belirlenmiştir. Ödemeler her ayın sonunda banka havalesi yoluyla yapılacaktır.
      </p>
      
      <h3 style="font-size: 14pt; font-weight: bold; margin: 20px 0 10px 0;">MADDE 4 - GENEL HÜKÜMLER</h3>
      <p style="text-align: justify; line-height: 1.6;">
        Bu sözleşmeden doğacak uyuşmazlıklarda Ankara Mahkemeleri ve İcra Daireleri yetkilidir. Sözleşme Türk Hukuku'na tabidir.
      </p>
      
      <div style="margin-top: 50px; display: flex; justify-content: space-between;">
        <div style="text-align: center; width: 40%;">
          <p>İŞVEREN</p>
          <br><br><br>
          <p>__________________</p>
          <p>[İmza]</p>
        </div>
        <div style="text-align: center; width: 40%;">
          <p>HİZMET SAĞLAYICI</p>
          <br><br><br>
          <p>__________________</p>
          <p>[İmza]</p>
        </div>
      </div>
    `
  }
];

export const getDocumentTemplate = (id: string): DocumentTemplate | undefined => {
  return documentTemplates.find(template => template.id === id);
};

export const loadDocumentTemplate = (templateId: string, editorRef: React.RefObject<HTMLDivElement>) => {
  const template = getDocumentTemplate(templateId);
  if (template && editorRef.current) {
    editorRef.current.innerHTML = template.content;
  }
};
