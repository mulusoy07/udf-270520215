
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import MobileSignatureDialog from '@/components/MobileSignatureDialog';
import ESignatureDialog from '@/components/ESignatureDialog';
import NavbarLogo from '@/components/navbar/NavbarLogo';
import NavbarSignatureButtons from '@/components/navbar/NavbarSignatureButtons';
import NavbarMobileMenu from '@/components/navbar/NavbarMobileMenu';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileSignatureOpen, setMobileSignatureOpen] = useState(false);
  const [eSignatureOpen, setESignatureOpen] = useState(false);
  const navigate = useNavigate();
  const isMobile = useMediaQuery('(max-width: 768px)');
  
  const navItems = [
    { name: "UDF Düzenleyici", href: "/editor" },
    { name: "Fiyatlandırma", href: "/pricing" },
    { name: "Hakkımızda", href: "/about" },
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleMenuItemClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleLoginClick = () => {
    if (isMobile) {
      setIsCollapsed(true);
    } else {
      setIsMenuOpen(false);
    }
    navigate("/login");
  };

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-md">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Mobile navbar - always visible but collapsible */}
            {isMobile ? (
              <div className="flex items-center justify-between w-full">
                {/* Collapsed mobile view */}
                {isCollapsed ? (
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={toggleCollapse}
                      className="p-1 hover:bg-gray-100"
                    >
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                ) : (
                  /* Expanded mobile view */
                  <>
                    <NavbarLogo />
                    
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={toggleCollapse}
                        className="p-2 hover:bg-gray-100"
                      >
                        <ChevronLeft size={20} />
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              /* Desktop view */
              <>
                <NavbarLogo />
                
                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center space-x-8">
                  {navItems.map((item) => (
                    <Link 
                      key={item.name} 
                      to={item.href} 
                      className="text-gray-600 hover:text-blue-600 transition-colors font-medium"
                    >
                      {item.name}
                    </Link>
                  ))}
                </div>
                
                {/* Desktop signature buttons and login */}
                <div className="hidden md:flex items-center gap-2">
                  <NavbarSignatureButtons
                    onMobileSignatureClick={() => setMobileSignatureOpen(true)}
                    onESignatureClick={() => setESignatureOpen(true)}
                  />
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700 text-white ml-2" 
                    onClick={() => navigate("/login")}
                  >
                    Giriş Yap
                  </Button>
                </div>
                
                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center">
                  <button 
                    onClick={toggleMenu} 
                    className="text-gray-500 hover:text-blue-600 focus:outline-none"
                  >
                    {isMenuOpen ? (
                      <X size={24} />
                    ) : (
                      <Menu size={24} />
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Mobile Menu - only for desktop when menu is opened */}
        <NavbarMobileMenu
          isMenuOpen={isMenuOpen}
          navItems={navItems}
          onItemClick={handleMenuItemClick}
          onLoginClick={handleLoginClick}
          isMobile={false}
        />
        
        {/* Mobile navigation menu - shown when expanded - NO signature buttons */}
        {!isCollapsed && isMobile && (
          <NavbarMobileMenu
            isMenuOpen={!isCollapsed}
            navItems={navItems}
            onItemClick={handleMenuItemClick}
            onLoginClick={handleLoginClick}
            isMobile={true}
          />
        )}
      </nav>
      
      {/* Dialog components - only for desktop */}
      {!isMobile && (
        <>
          <MobileSignatureDialog open={mobileSignatureOpen} onOpenChange={setMobileSignatureOpen} />
          <ESignatureDialog open={eSignatureOpen} onOpenChange={setESignatureOpen} />
        </>
      )}
    </>
  );
};

export default Navbar;
