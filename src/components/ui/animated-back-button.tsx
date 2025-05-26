
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface AnimatedBackButtonProps {
  title: string;
  subtitle: string;
  onClick?: () => void;
}

const AnimatedBackButton: React.FC<AnimatedBackButtonProps> = ({ 
  title, 
  subtitle, 
  onClick 
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate('/editor');
    }
  };

  return (
    <div className="mb-8">
      <Card className="border-l-4 border-l-blue-500 bg-gradient-to-r from-blue-50 to-transparent dark:from-blue-950/20 overflow-hidden">
        <CardContent className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={handleClick}
                className="group flex items-center gap-3 text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/20 transition-all duration-300 text-base font-medium hover:scale-105"
              >
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-all duration-300 group-hover:scale-110">
                  <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
                </div>
                <span className="transition-all duration-300 group-hover:translate-x-1">Editor'e Geri Dön</span>
              </Button>
              <div className="hidden sm:block h-8 border-r border-blue-200 dark:border-blue-800"></div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h1>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Home className="h-5 w-5 text-blue-400 opacity-60" />
            </div>
          </div>
          
          {/* Mobile title - only shown on small screens */}
          <div className="sm:hidden mt-4 pl-2">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{title}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{subtitle}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnimatedBackButton;
