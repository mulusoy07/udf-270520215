
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
          UDF belgelerinizi <span className="text-blue-600">kolayca</span> düzenleyin
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-xl mx-auto">
          UDF belgelerinizi kolayca düzenleyin, imzalayın ve yönetin! Profesyonel çözümlerle 
          belgelerinizin güvenliği ve bütünlüğü bizim önceliğimiz.
        </p>
        <Button 
          className="bg-blue-600 hover:bg-blue-700 text-white text-lg px-8 py-3 h-auto"
          onClick={() => navigate('/editor')}
        >
          Hemen Başla
        </Button>
      </div>
    </div>
  );
};

export default Index;
