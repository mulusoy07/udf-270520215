
import React from 'react';
import { Link } from 'react-router-dom';

const NavbarLogo: React.FC = () => {
  return (
    <div className="flex-shrink-0 font-bold text-xl md:text-2xl">
      <Link to="/" className="flex items-center">
        <span className="font-bold text-blue-600">UDF</span>
        <span className="text-blue-400">Editör</span>
      </Link>
    </div>
  );
};

export default NavbarLogo;
