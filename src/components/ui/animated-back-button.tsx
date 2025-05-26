
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
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
      <div className="flex flex-col space-y-4">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleClick}
          className="group self-start flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-all duration-200 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span className="font-medium">Editor'e Geri Dön</span>
        </Button>
        
        {/* Page Header */}
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackButton;
