
import React from 'react';
import { Button } from "@/components/ui/button";
import { Smartphone, FileSignature } from 'lucide-react';

interface NavbarSignatureButtonsProps {
  onMobileSignatureClick: () => void;
  onESignatureClick: () => void;
  isMobile?: boolean;
}

const NavbarSignatureButtons: React.FC<NavbarSignatureButtonsProps> = ({
  onMobileSignatureClick,
  onESignatureClick,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <div className="flex items-center gap-0">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onMobileSignatureClick}
          className="h-7 w-7 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          title="Mobil İmza"
        >
          <Smartphone size={16} className="text-blue-600 dark:text-blue-400" />
        </Button>
        <Button 
          variant="ghost" 
          size="icon"
          onClick={onESignatureClick}
          className="h-7 w-7 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          title="E-İmza"
        >
          <FileSignature size={16} className="text-green-600 dark:text-green-400" />
        </Button>
      </div>
    );
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onMobileSignatureClick}
        className="flex items-center text-xs md:text-sm hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
      >
        <Smartphone size={16} className="text-blue-600 dark:text-blue-400 mr-1 md:mr-1.5" />
        <span>Mobil İmza</span>
      </Button>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onESignatureClick}
        className="flex items-center text-xs md:text-sm hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
      >
        <FileSignature size={16} className="text-green-600 dark:text-green-400 mr-1 md:mr-1.5" />
        <span>E-İmza</span>
      </Button>
    </>
  );
};

export default NavbarSignatureButtons;
