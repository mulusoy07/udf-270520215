
import React from 'react';
import { Smartphone, Shield, Globe, File, Pen, Download } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
}

const FeatureCard: React.FC<FeatureProps> = ({ title, description, icon }) => {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <div className="mb-4 p-3.5 rounded-full bg-gradient-to-r from-blue-600 to-blue-400 text-white">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

const Features: React.FC = () => {
  const features: FeatureProps[] = [
    {
      title: "Hızlı",
      description: "Tüm tarayıcılardan tek tıkla hızlı işlem yapabilirsiniz.",
      icon: <Download size={24} />,
    },
    {
      title: "Güvenli",
      description: "Belgeleriniz şifreli ve güvenli şekilde saklanır.",
      icon: <Shield size={24} />,
    },
    {
      title: "Platformlar Arası",
      description: "Tüm cihazlardan erişim imkânı sunuyoruz.",
      icon: <Globe size={24} />,
    },
    {
      title: "Esnek Düzenleme",
      description: "Belgelerinizi kolayca kişiselleştirebilirsiniz.",
      icon: <File size={24} />,
    },
    {
      title: "İmza Uyumlu",
      description: "Mobil, USB ve e-İmza desteği mevcuttur.",
      icon: <Pen size={24} />,
    },
    {
      title: "Mobil Uyumlu",
      description: "Mobil cihazlardan da düzenleme yapabilirsiniz.",
      icon: <Smartphone size={24} />,
    },
  ];

  return (
    <div className="bg-gray-50 py-20" id="features">
      <div className="container mx-auto px-4">
        <div className="mb-14 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Neden UDF Editör?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            UDF belgelerinizi profesyonel bir şekilde düzenlemek için ihtiyacınız olan tüm özellikleri sunuyoruz.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;
