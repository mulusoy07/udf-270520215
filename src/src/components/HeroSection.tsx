
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-gradient-to-b from-blue-50 to-white py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 animate-fade-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight mb-6">
              UDF belgelerinizi <span className="text-blue-600">kolayca</span> düzenleyin
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              UDF belgelerinizi kolayca düzenleyin, imzalayın ve yönetin! Profesyonel çözümlerle 
              belgelerinizin güvenliği ve bütünlüğü bizim önceliğimiz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-blue-600 hover:bg-blue-700 text-white text-base"
                onClick={() => navigate('/editor')}
              >
                Hemen Başla
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-600 text-blue-600 hover:bg-blue-50 text-base"
                onClick={() => navigate('/pricing')}
              >
                Planları İncele
              </Button>
            </div>
          </div>

          <div className="md:w-1/2 p-4 animate-fade-in">
            <div className="relative bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
              <div className="bg-gray-100 h-10 flex items-center px-4 border-b border-gray-200">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto text-sm text-gray-500">UDF Editör</div>
              </div>
              <div className="p-4">
                <div className="bg-gray-50 p-6 rounded border border-gray-200">
                  <div className="h-8 bg-blue-600 w-1/3 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 w-full rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 w-5/6 rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 w-full rounded mb-3"></div>
                  <div className="h-4 bg-gray-200 w-4/6 rounded mb-6"></div>
                  <div className="flex space-x-2 mb-4">
                    <div className="h-8 bg-blue-400 w-1/4 rounded"></div>
                    <div className="h-8 bg-gray-300 w-1/4 rounded"></div>
                  </div>
                  <div className="h-32 bg-white border border-gray-200 rounded-lg p-2">
                    <div className="h-4 bg-gray-100 w-3/4 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 w-1/2 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 w-5/6 rounded mb-2"></div>
                    <div className="h-4 bg-gray-100 w-2/3 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-100 h-10 flex items-center justify-between px-4 border-t border-gray-200">
                <div className="w-24 h-4 bg-gray-300 rounded"></div>
                <div className="w-16 h-4 bg-blue-400 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
