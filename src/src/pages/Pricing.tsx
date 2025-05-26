
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Check } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Pricing = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annually'>('monthly');
  const navigate = useNavigate();

  const plans = [
    {
      name: "Başlangıç",
      description: "Bireysel kullanıcılar için ideal",
      monthlyPrice: 49,
      annualPrice: 39,
      features: [
        "Aylık 5 UDF belgesi düzenleme",
        "Sınırlı şablonlar",
        "Temel imza özellikleri",
        "E-posta desteği",
        "Bulut depolama 500MB"
      ],
      popular: false,
      color: "gray"
    },
    {
      name: "Profesyonel",
      description: "Profesyoneller ve küçük işletmeler için",
      monthlyPrice: 99,
      annualPrice: 79,
      features: [
        "Aylık 25 UDF belgesi düzenleme",
        "Tüm şablonlara erişim",
        "Gelişmiş imza özellikleri",
        "Öncelikli destek",
        "Bulut depolama 5GB",
        "2 kullanıcı"
      ],
      popular: true,
      color: "blue"
    },
    {
      name: "Kurumsal",
      description: "Büyük işletmeler ve kurumlar için",
      monthlyPrice: 249,
      annualPrice: 199,
      features: [
        "Sınırsız UDF belgesi düzenleme",
        "Özel şablon oluşturma",
        "Tüm imza özellikleri",
        "7/24 destek",
        "Bulut depolama 50GB",
        "10 kullanıcı",
        "API erişimi",
        "Özel entegrasyonlar"
      ],
      popular: false,
      color: "gray"
    }
  ];

  const handlePlanSelect = (planName: string) => {
    navigate('/login');
  };

  const renderPrice = (plan) => {
    const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.annualPrice;
    return (
      <>
        <span className="text-4xl font-bold">{price}</span>
        <span className="text-lg font-medium ml-1">₺</span>
        <span className="text-gray-500 ml-2">/ aylık</span>
      </>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-4xl font-bold text-gray-800 mb-6">Basit ve Şeffaf Fiyatlandırma</h1>
            <p className="text-xl text-gray-600 mb-8">
              İhtiyaçlarınıza uygun planı seçin ve hemen UDF belgelerinizi düzenlemeye başlayın.
            </p>
            
            <div className="inline-flex items-center p-1 bg-gray-100 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md font-medium ${
                  billingCycle === 'monthly'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Aylık Ödeme
              </button>
              <button
                onClick={() => setBillingCycle('annually')}
                className={`px-4 py-2 rounded-md font-medium ${
                  billingCycle === 'annually'
                    ? 'bg-white shadow-sm text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Yıllık Ödeme
                <span className="ml-2 bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">%20 Tasarruf</span>
              </button>
            </div>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan) => (
              <div 
                key={plan.name}
                className={`relative bg-white rounded-xl shadow-lg overflow-hidden border ${
                  plan.popular ? 'border-blue-500 transform scale-105 md:-translate-y-2' : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 text-sm font-medium">
                    En Popüler
                  </div>
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h2>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="flex items-end mb-6">
                    {renderPrice(plan)}
                  </div>
                  
                  <Button 
                    className={`w-full mb-6 ${
                      plan.popular 
                        ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                        : 'bg-gray-800 hover:bg-gray-900 text-white'
                    }`}
                    onClick={() => handlePlanSelect(plan.name)}
                  >
                    {plan.popular ? 'Hemen Başla' : 'Planı Seç'}
                  </Button>
                  
                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <Check size={18} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          {/* Custom Plan */}
          <div className="mt-16 bg-gray-100 rounded-xl p-8 max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="md:w-2/3 mb-6 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Özel Çözüm mü Arıyorsunuz?</h2>
                <p className="text-gray-600">
                  Kurumunuzun ihtiyaçlarına özel fiyatlandırma ve çözümler için satış ekibimizle görüşün.
                </p>
              </div>
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50"
              >
                Bize Ulaşın
              </Button>
            </div>
          </div>
          
          {/* FAQ */}
          <div className="mt-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Sıkça Sorulan Sorular</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Aboneliğimi istediğim zaman iptal edebilir miyim?</h3>
                <p className="text-gray-600">Evet, aboneliğinizi istediğiniz zaman iptal edebilirsiniz. İptal etmeniz durumunda, ödeme döneminin sonuna kadar hizmetlerimizi kullanmaya devam edebilirsiniz.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Planımı daha sonra yükseltebilir miyim?</h3>
                <p className="text-gray-600">Evet, ihtiyaçlarınız değiştikçe planınızı kolayca yükseltebilirsiniz. Yükseltme yaparken, kalan süre için orantılı ücretlendirme yapılır.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Birden fazla kullanıcı için fiyatlandırma nasıl çalışır?</h3>
                <p className="text-gray-600">Profesyonel plan 2 kullanıcı, Kurumsal plan ise 10 kullanıcı içerir. Daha fazla kullanıcı eklemek isterseniz, her kullanıcı için ek ücret ödeyebilirsiniz.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Deneme süresi var mı?</h3>
                <p className="text-gray-600">Evet, tüm planlarımız için 14 günlük ücretsiz deneme süresi sunuyoruz. Deneme süresi içinde herhangi bir ödeme yapmanız gerekmez ve istediğiniz zaman iptal edebilirsiniz.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Pricing;
