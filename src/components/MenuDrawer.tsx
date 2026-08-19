import React from 'react';
import { X, ArrowUpRight, Heart, FileText, BarChart2, Mail, ExternalLink } from 'lucide-react';

interface MenuDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPolicy: () => void;
  onOpenReport: () => void;
  onOpenContact: () => void;
  onOpenJoin: () => void;
}

export const MenuDrawer: React.FC<MenuDrawerProps> = ({
  isOpen,
  onClose,
  onOpenPolicy,
  onOpenReport,
  onOpenContact,
  onOpenJoin,
}) => {
  if (!isOpen) return null;

  const scrollTo = (id: string) => {
    onClose();
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex bg-black/80 backdrop-blur-xs animate-fade-in">
      <div
        id="side-navigation-menu"
        className="w-full max-w-sm bg-[#0d150f] border-r border-[#46464d] h-full flex flex-col justify-between text-[#dce5d9] p-6 shadow-2xl relative animate-slide-right overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#46464d] pb-4">
          <span className="font-anybody font-extrabold text-[24px] tracking-tight uppercase text-[#dce5d9]">
            OSANELI
          </span>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="text-[#c6c6ce] hover:text-[#e9c349] transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Links Navigation */}
        <div className="py-6 space-y-6 flex-1">
          <div className="space-y-1">
            <span className="font-mono-tag text-[10px] text-[#e9c349] uppercase tracking-[0.2em] font-bold">
              Navegación
            </span>
            <nav className="flex flex-col space-y-3 pt-2">
              <button
                onClick={() => scrollTo('hero-section')}
                className="text-left font-anybody text-[20px] font-bold uppercase text-[#dce5d9] hover:text-[#e9c349] transition-colors flex items-center justify-between group"
              >
                <span>01. Todos Somos Colombia</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#e9c349]" />
              </button>

              <button
                onClick={() => scrollTo('context-section')}
                className="text-left font-anybody text-[20px] font-bold uppercase text-[#dce5d9] hover:text-[#e9c349] transition-colors flex items-center justify-between group"
              >
                <span>02. El Contexto / La Realidad</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#e9c349]" />
              </button>

              <button
                onClick={() => scrollTo('context-section')}
                className="text-left font-anybody text-[20px] font-bold uppercase text-[#dce5d9] hover:text-[#e9c349] transition-colors flex items-center justify-between group"
              >
                <span>03. La Colección (Camiseta & Short)</span>
                <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-[#e9c349]" />
              </button>
            </nav>
          </div>

          <div className="border-t border-[#46464d] pt-6 space-y-3">
            <span className="font-mono-tag text-[10px] text-[#e9c349] uppercase tracking-[0.2em] font-bold">
              Transparencia y Acción
            </span>
            <div className="space-y-2 font-mono-tag text-[13px]">
              <button
                onClick={() => {
                  onClose();
                  onOpenPolicy();
                }}
                className="w-full text-left py-2 px-3 bg-[#1a221a] hover:bg-[#242c24] border border-[#46464d] hover:border-[#e9c349] transition-colors flex items-center gap-2.5 text-[#dce5d9]"
              >
                <FileText className="w-4 h-4 text-[#e9c349]" />
                <span>Solidarity Policy</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenReport();
                }}
                className="w-full text-left py-2 px-3 bg-[#1a221a] hover:bg-[#242c24] border border-[#46464d] hover:border-[#e9c349] transition-colors flex items-center gap-2.5 text-[#dce5d9]"
              >
                <BarChart2 className="w-4 h-4 text-[#e9c349]" />
                <span>Impact Report (Auditoría)</span>
              </button>

              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="w-full text-left py-2 px-3 bg-[#1a221a] hover:bg-[#242c24] border border-[#46464d] hover:border-[#e9c349] transition-colors flex items-center gap-2.5 text-[#dce5d9]"
              >
                <Mail className="w-4 h-4 text-[#e9c349]" />
                <span>Contacto Directo / Brigadas</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer in Drawer */}
        <div className="border-t border-[#46464d] pt-4 space-y-3">
          <button
            onClick={() => {
              onClose();
              onOpenJoin();
            }}
            className="w-full py-3 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold text-[12px] uppercase tracking-wider hover:bg-[#ffe088] transition-colors flex items-center justify-center gap-2"
          >
            <Heart className="w-4 h-4 fill-[#241a00]" />
            <span>Únete al Movimiento</span>
          </button>
          <p className="font-mono-tag text-[10px] text-[#c6c6ce] text-center">
            OSANELI © 2026 · CARTAGENA DE INDIAS, COLOMBIA
          </p>
        </div>
      </div>
    </div>
  );
};
