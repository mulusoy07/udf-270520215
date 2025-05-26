
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
      <div className="flex items-start gap-4">
        {/* Modern Back Arrow Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClick}
          className="group mt-1 p-2 h-10 w-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200 flex items-center justify-center"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-100 transition-all duration-200 group-hover:-translate-x-0.5" />
        </Button>
        
        {/* Page Header */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{title}</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">{subtitle}</p>
        </div>
      </div>
    </div>
  );
};

export default AnimatedBackButton;
