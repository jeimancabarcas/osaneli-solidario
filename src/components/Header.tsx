import React from 'react';
import { Menu, ShoppingBag } from 'lucide-react';

interface HeaderProps {
  onOpenMenu: () => void;
  onOpenCart: () => void;
  cartCount: number;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMenu, onOpenCart, cartCount }) => {
  return (
    <header
      id="top-header"
      className="bg-[#0d150f] border-b border-[#46464d] w-full fixed top-0 z-50 h-16 flex justify-between items-center px-4 md:px-16 transition-colors duration-300"
    >
      <button
        id="btn-menu"
        onClick={onOpenMenu}
        aria-label="Abrir menú"
        className="text-[#c6c6ce] hover:text-[#e9c349] transition-colors duration-200 p-2 -ml-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e9c349] flex items-center justify-center"
      >
        <Menu className="w-6 h-6 stroke-[1.75]" />
      </button>

      <a
        id="brand-logo"
        href="#"
        className="font-anybody font-extrabold text-[28px] md:text-[32px] tracking-tighter text-[#dce5d9] hover:text-[#e9c349] uppercase transition-colors text-center"
      >
        OSANELI
      </a>

      <button
        id="btn-shopping-bag"
        onClick={onOpenCart}
        aria-label="Bolsa de compras"
        className="text-[#c6c6ce] hover:text-[#e9c349] transition-colors duration-200 p-2 -mr-2 relative rounded-sm focus:outline-none focus:ring-1 focus:ring-[#e9c349] flex items-center justify-center"
      >
        <ShoppingBag className="w-6 h-6 stroke-[1.75]" />
        {cartCount > 0 && (
          <span
            id="cart-badge-count"
            className="absolute -top-1 -right-1 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-pulse"
          >
            {cartCount}
          </span>
        )}
      </button>
    </header>
  );
};
