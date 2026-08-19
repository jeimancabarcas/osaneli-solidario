import React from 'react';
import { X, ZoomIn, Download, ExternalLink } from 'lucide-react';

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="relative max-w-5xl w-full flex flex-col items-center">
        {/* Top Control Bar */}
        <div className="w-full flex justify-between items-center text-[#dce5d9] mb-3 px-2">
          <div className="font-mono-tag text-[12px] uppercase text-[#e9c349] tracking-wider truncate max-w-md">
            {title || 'Visualización de Imagen OSANELI'}
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar imagen"
            className="text-[#c6c6ce] hover:text-[#e9c349] transition-colors p-1.5 bg-[#1a221a] border border-[#46464d]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Image Container */}
        <div className="relative border border-[#46464d] bg-[#0d150f] max-h-[80vh] overflow-hidden flex items-center justify-center">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[80vh] w-auto max-w-full object-contain"
          />
        </div>

        {/* Caption */}
        <div className="mt-3 font-mono-tag text-[11px] text-[#c6c6ce] text-center">
          ARCHIVO OFICIAL DE LA CAMPAÑA · 10 AGOSTO 2026 · OSANELI
        </div>
      </div>
    </div>
  );
};
