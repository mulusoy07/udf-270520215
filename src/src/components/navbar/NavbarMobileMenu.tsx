
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

interface NavbarMobileMenuProps {
  isMenuOpen: boolean;
  navItems: Array<{ name: string; href: string }>;
  onItemClick: () => void;
  onLoginClick: () => void;
  isMobile: boolean;
}

const NavbarMobileMenu: React.FC<NavbarMobileMenuProps> = ({
  isMenuOpen,
  navItems,
  onItemClick,
  onLoginClick,
  isMobile
}) => {
  // Show menu only when isMenuOpen is true and not mobile (for desktop hamburger menu)
  // OR when not collapsed and is mobile (for mobile navigation)
  const shouldShowMenu = (isMenuOpen && !isMobile) || (!isMenuOpen && isMobile);

  if (!shouldShowMenu) return null;

  return (
    <div className="bg-white py-2 px-4 shadow-lg border-t">
      <div className="flex flex-col space-y-3 pb-3">
        {navItems.map((item) => (
          <Link 
            key={item.name} 
            to={item.href} 
            className="text-gray-600 hover:text-blue-600 py-2 text-base font-medium"
            onClick={onItemClick}
          >
            {item.name}
          </Link>
        ))}
        <div className="pt-2">
          <Button 
            className="w-full justify-center bg-blue-600 hover:bg-blue-700" 
            onClick={onLoginClick}
          >
            Giriş Yap
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NavbarMobileMenu;
