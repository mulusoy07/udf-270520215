
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-gray-800 mb-6">Hakkımızda</h1>
              <p className="text-xl text-gray-600 mb-8">
                UDF Editör, Türkiye'nin önde gelen belge düzenleme ve imzalama platformudur. 
                2018 yılından beri binlerce kullanıcıya hizmet veriyoruz.
              </p>
            </div>
          </div>
        </div>
        
        {/* Misyon ve Vizyon */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <div className="bg-blue-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Misyonumuz</h2>
                <p className="text-gray-600">
                  UDF belgelerinin oluşturulması, düzenlenmesi ve imzalanması süreçlerini 
                  herkes için kolay ve erişilebilir hale getirerek, iş ve resmi işlemlerdeki 
                  dijital dönüşümü hızlandırmak.
                </p>
              </div>
              
              <div className="bg-blue-50 p-8 rounded-xl">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Vizyonumuz</h2>
                <p className="text-gray-600">
                  Belge yönetimi ve elektronik imza alanında Türkiye'nin lider platformu olmak 
                  ve global pazarda ülkemizi başarıyla temsil etmek.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Şirket Hikayesi */}
        <div className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Hikayemiz</h2>
              
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/3 bg-blue-100 h-64 rounded-xl flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">2018</span>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Başlangıç</h3>
                    <p className="text-gray-600">
                      Üç yazılım mühendisinin UDF belgelerinin düzenlenmesi konusundaki zorluklara çözüm 
                      bulma arayışıyla UDF Editör'ün temelleri atıldı.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/3 bg-blue-100 h-64 rounded-xl flex items-center justify-center md:order-last">
                    <span className="text-4xl font-bold text-blue-600">2020</span>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Büyüme Dönemi</h3>
                    <p className="text-gray-600">
                      İlk kurumsal müşterilerimizle çalışmaya başladık ve ekibimizi genişlettik. 
                      Elektronik imza entegrasyonları tamamlandı ve platform kullanıcı sayısı 10,000'i aştı.
                    </p>
                  </div>
                </div>
                
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <div className="md:w-1/3 bg-blue-100 h-64 rounded-xl flex items-center justify-center">
                    <span className="text-4xl font-bold text-blue-600">2023</span>
                  </div>
                  <div className="md:w-2/3">
                    <h3 className="text-xl font-semibold mb-2">Günümüz</h3>
                    <p className="text-gray-600">
                      Bugün 30 kişilik ekibimizle 50.000'den fazla kullanıcıya ve 500'den fazla kurumsal 
                      müşteriye hizmet veriyoruz. Yazılım ve güvenlik alanındaki uzmanlığımızla 
                      Türkiye'nin en güvenilir UDF platformu olmayı başardık.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Ekip */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Ekibimizle Tanışın</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div className="w-40 h-40 bg-gray-200 rounded-full mb-4"></div>
                    <h3 className="text-xl font-semibold text-gray-800">İsim Soyisim</h3>
                    <p className="text-gray-600">Pozisyon</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* İletişim CTA */}
        <div className="py-16 bg-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-6">Projeleriniz için UDF Editör'ü keşfedin</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Size özel çözümler için ekibimizle iletişime geçin
            </p>
            <button className="bg-white text-blue-600 hover:bg-blue-100 px-8 py-3 rounded-lg font-medium text-lg">
              Bizimle İletişime Geçin
            </button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default About;
