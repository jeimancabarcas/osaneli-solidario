import React, { useState } from 'react';
import { ZoomIn, Eye, ShoppingBag, Check } from 'lucide-react';
import { IMAGES, COLLECTION_PIECES } from '../data/mockData';
import { CollectionPiece } from '../types';

interface ContextSectionProps {
  onOpenImageLightbox: (url: string, title: string) => void;
  onAddToCart: (piece: CollectionPiece, size: string) => void;
  onSelectPieceForJoin: (piece: CollectionPiece) => void;
}

export const ContextSection: React.FC<ContextSectionProps> = ({
  onOpenImageLightbox,
  onAddToCart,
  onSelectPieceForJoin,
}) => {
  const [selectedPiece, setSelectedPiece] = useState<CollectionPiece>(COLLECTION_PIECES[0]);
  const [selectedSize, setSelectedSize] = useState<string>('L');
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (piece: CollectionPiece) => {
    onAddToCart(piece, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  return (
    <section
      id="context-section"
      className="w-full pt-16 md:pt-24 pb-20 border-t border-[#46464d]"
    >
      {/* Section Header */}
      <div className="text-center md:text-left mb-12 md:mb-16">
        <h2
          id="context-title"
          className="font-anybody font-bold text-[32px] md:text-[44px] uppercase text-[#dce5d9] tracking-tight text-center"
        >
          EL CONTEXTO
        </h2>
        <p className="text-[16px] md:text-[18px] text-[#c6c6ce] max-w-2xl mx-auto text-center mt-3">
          La realidad que nos mueve. Una colección nacida de la necesidad de apoyar y reconstruir juntos.
        </p>
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
        {/* Left Column: LA REALIDAD */}
        <div id="column-reality" className="flex flex-col gap-6">
          <div className="space-y-3">
            <h3 className="font-mono-tag text-[13px] md:text-[14px] font-bold text-[#e9c349] uppercase tracking-[0.15em] border-b border-[#46464d] pb-2 flex items-center justify-between">
              <span>La Realidad</span>
              <span className="text-[#c6c6ce] text-[11px] font-normal">EMERGENCIA & ACCIÓN</span>
            </h3>
            <p className="text-[15px] md:text-[16px] leading-[24px] text-[#c6c6ce]">
              Una mirada a la situación actual en Colombia y el esfuerzo incansable de quienes están en primera línea ayudando a nuestras comunidades a salir adelante tras la emergencia.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Image 1: Rescue Workers */}
            <div
              className="group relative border border-[#46464d] bg-[#161d16] overflow-hidden cursor-pointer shadow-lg"
              onClick={() => onOpenImageLightbox(IMAGES.rescueWorkers, 'Cuerpos de rescate y voluntarios en primera línea - Colombia')}
            >
              <img
                src={IMAGES.rescueWorkers}
                alt="Cuerpos de rescate y brigadistas en zona de emergencia"
                className="w-full aspect-[16/10] md:aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0d150f]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-mono-tag text-[12px] bg-[#0d150f]/90 text-[#e9c349] px-3 py-1.5 border border-[#e9c349] flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> AMPLIAR FOTOGRAFÍA
                </span>
              </div>
              <div className="p-3 bg-[#161d16] border-t border-[#46464d] flex justify-between items-center text-[12px] font-mono-tag text-[#c6c6ce]">
                <span>01 / BRIGADAS DE RESCATE</span>
                <span className="text-[#e9c349]">APOYO INMEDIATO</span>
              </div>
            </div>

            {/* Image 2: Damaged Buildings */}
            <div
              className="group relative border border-[#46464d] bg-[#161d16] overflow-hidden cursor-pointer shadow-lg"
              onClick={() => onOpenImageLightbox(IMAGES.damagedBuildings, 'Zonas afectadas en proceso de remoción y reconstrucción comunitaria')}
            >
              <img
                src={IMAGES.damagedBuildings}
                alt="Infraestructura afectada y labores de remoción comunitaria"
                className="w-full aspect-[16/10] md:aspect-[4/3] object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0d150f]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-mono-tag text-[12px] bg-[#0d150f]/90 text-[#e9c349] px-3 py-1.5 border border-[#e9c349] flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> AMPLIAR FOTOGRAFÍA
                </span>
              </div>
              <div className="p-3 bg-[#161d16] border-t border-[#46464d] flex justify-between items-center text-[12px] font-mono-tag text-[#c6c6ce]">
                <span>02 / RECONSTRUCCIÓN DE HOGARES</span>
                <span className="text-[#e9c349]">MATERIALES DE ALIVIO</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: NUESTRA RESPUESTA / LA COLECCIÓN */}
        <div id="column-response" className="flex flex-col gap-6">
          <div className="space-y-3">
            <h3 className="font-mono-tag text-[13px] md:text-[14px] font-bold text-[#e9c349] uppercase tracking-[0.15em] border-b border-[#46464d] pb-2 flex items-center justify-between">
              <span>Nuestra Respuesta / La Colección</span>
              <span className="text-[#c6c6ce] text-[11px] font-normal">200 PIEZAS ÚNICAS</span>
            </h3>
            <p className="text-[15px] md:text-[16px] leading-[24px] text-[#c6c6ce]">
              Transformamos la solidaridad en arte tangible. A través de estos diseños y prendas exclusivas, canalizamos el apoyo directo para reconstruir y avanzar juntos.
            </p>
          </div>

          <div className="flex flex-col gap-6">
            {/* Graphic 1: I Love Colombia 10 Agosto 2026 */}
            <div
              className="group relative border border-[#46464d] bg-[#08100a] overflow-hidden cursor-pointer shadow-lg"
              onClick={() => onOpenImageLightbox(IMAGES.iloveColombia, 'I Love Colombia - Gráfica Oficial de Solidaridad')}
            >
              <img
                src={IMAGES.iloveColombia}
                alt="Gráfica I Love Colombia 10 Agosto 2026"
                className="w-full h-auto object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0d150f]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-mono-tag text-[12px] bg-[#0d150f]/90 text-[#e9c349] px-3 py-1.5 border border-[#e9c349] flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> VER ARTE GRÁFICO
                </span>
              </div>
              <div className="p-3 bg-[#161d16] border-t border-[#46464d] flex justify-between items-center text-[12px] font-mono-tag text-[#c6c6ce]">
                <span>ARTE OFICIAL / 10 AGOSTO 2026</span>
                <span className="text-[#e9c349]">DISEÑO VECTORIAL</span>
              </div>
            </div>

            {/* Graphic 2: Collection Mockup Grid */}
            <div
              className="group relative border border-[#46464d] bg-[#08100a] overflow-hidden cursor-pointer shadow-lg"
              onClick={() => onOpenImageLightbox(IMAGES.collectionGrid, 'Muestra completa de la colección solidaria de 200 piezas')}
            >
              <img
                src={IMAGES.collectionGrid}
                alt="Colección completa de camisetas, cropped tops y bermudas de denim"
                className="w-full h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#0d150f]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="font-mono-tag text-[12px] bg-[#0d150f]/90 text-[#e9c349] px-3 py-1.5 border border-[#e9c349] flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5" /> EXPLORAR CATÁLOGO COMPLETO
                </span>
              </div>
              <div className="p-3 bg-[#161d16] border-t border-[#46464d] flex justify-between items-center text-[12px] font-mono-tag text-[#c6c6ce]">
                <span>EDICIÓN NUMERADA 1 - 200</span>
                <span className="text-[#e9c349]">100% FONDOS DE APOYO</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Piece Explorer Strip */}
      <div className="mt-16 bg-[#1a221a] border border-[#46464d] p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-[#46464d] pb-4">
          <div>
            <span className="font-mono-tag text-[11px] uppercase tracking-[0.2em] text-[#e9c349] font-bold">
              Catálogo Interactivo
            </span>
            <h4 className="font-anybody text-[22px] md:text-[26px] text-[#dce5d9] font-bold">
              Selecciona una pieza con propósito
            </h4>
          </div>
          <div className="font-mono-tag text-[12px] text-[#c6c6ce] bg-[#242c24] px-3 py-1.5 border border-[#46464d]">
            PIEZAS DISPONIBLES: <span className="text-[#e9c349] font-bold">58 / 200</span>
          </div>
        </div>

        {/* Piece Selector Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
          {COLLECTION_PIECES.map((piece) => {
            const isSelected = selectedPiece.id === piece.id;
            return (
              <button
                key={piece.id}
                onClick={() => setSelectedPiece(piece)}
                className={`p-3 text-left border transition-all cursor-pointer flex flex-col justify-between h-24 ${
                  isSelected
                    ? 'border-[#e9c349] bg-[#242c24] text-[#e9c349]'
                    : 'border-[#46464d] bg-[#161d16] text-[#c6c6ce] hover:border-[#c6c6ce]'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span
                    className="w-3 h-3 border border-white/20 rounded-full"
                    style={{ backgroundColor: piece.color }}
                  />
                  <span className="font-mono-tag text-[9px] uppercase tracking-wider text-[#c6c6ce]/70">
                    #{piece.editionNumber}
                  </span>
                </div>
                <div className="font-mono-tag text-[11px] font-bold uppercase truncate">
                  {piece.tag}
                </div>
                <div className="font-mono-tag text-[11px] text-[#dce5d9]">
                  ${piece.priceUSD} USD
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Piece Details & Quick Action */}
        <div className="bg-[#161d16] border border-[#46464d] p-5 flex flex-col lg:flex-row gap-6 justify-between items-start lg:items-center">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-3">
              <span className="font-mono-tag text-[10px] bg-[#e9c349] text-[#241a00] font-bold px-2 py-0.5 uppercase">
                Edición #{selectedPiece.editionNumber} de {selectedPiece.totalEdition}
              </span>
              <span className="font-mono-tag text-[12px] text-[#c6c6ce]">
                Tono: {selectedPiece.colorName}
              </span>
            </div>
            <h5 className="font-anybody text-[18px] md:text-[20px] font-bold text-[#dce5d9]">
              {selectedPiece.name}
            </h5>
            <p className="text-[14px] text-[#c6c6ce] leading-relaxed">
              {selectedPiece.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            {/* Size Selector */}
            <div className="flex items-center gap-2">
              <span className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase">Talla:</span>
              <div className="flex gap-1.5">
                {['S', 'M', 'L', 'XL'].map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-8 h-8 font-mono-tag text-[12px] font-bold border transition-colors cursor-pointer ${
                      selectedSize === size
                        ? 'border-[#e9c349] bg-[#e9c349] text-[#241a00]'
                        : 'border-[#46464d] bg-[#242c24] text-[#dce5d9] hover:border-[#c6c6ce]'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={() => handleQuickAdd(selectedPiece)}
              className={`py-3 px-5 font-mono-tag text-[12px] uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                addedAnimation
                  ? 'bg-emerald-500 text-white'
                  : 'bg-[#e9c349] text-[#241a00] hover:bg-[#ffe088]'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Añadido a la bolsa</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Adquirir pieza (${selectedPiece.priceUSD} USD)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
