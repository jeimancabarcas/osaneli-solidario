import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { COLLECTION_PIECES } from '../data/mockData';
import { CollectionPiece } from '../types';

interface JoinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoinSuccess: (donorName: string, message: string, pieceName?: string) => void;
  initialPiece?: CollectionPiece | null;
}

export const JoinModal: React.FC<JoinModalProps> = ({
  isOpen,
  onClose,
  onJoinSuccess,
  initialPiece,
}) => {
  const [selectedPieceId, setSelectedPieceId] = useState<string>(
    initialPiece?.id || COLLECTION_PIECES[0].id
  );
  const [size, setSize] = useState<string>('L');
  const [donorName, setDonorName] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<number>(48);
  const [actionType, setActionType] = useState<'piece' | 'donation'>('piece');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentPiece = COLLECTION_PIECES.find((p) => p.id === selectedPieceId) || COLLECTION_PIECES[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = donorName.trim() || 'Solidario Anónimo';
    const finalMessage = message.trim() || 'Unidos por Colombia.';
    const itemSupported = actionType === 'piece' 
      ? `${currentPiece.name} (Talla ${size})` 
      : `Donación Directa ($${customAmount} USD)`;

    onJoinSuccess(finalName, finalMessage, itemSupported);
    setIsSuccess(true);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div
        id="join-movement-modal"
        className="bg-[#161d16] border border-[#46464d] w-full max-w-xl text-[#dce5d9] p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar"
      >
        <button
          onClick={onClose}
          aria-label="Cerrar ventana"
          className="absolute top-5 right-5 text-[#c6c6ce] hover:text-[#e9c349] transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>

        {isSuccess ? (
          <div className="text-center py-8 space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-[#e9c349]/10 border border-[#e9c349] text-[#e9c349] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-widest font-bold">
                Impacto Registrado
              </span>
              <h3 className="font-anybody text-[28px] font-bold text-[#dce5d9] uppercase">
                ¡Gracias por tu Solidaridad!
              </h3>
              <p className="text-[15px] text-[#c6c6ce] max-w-md mx-auto">
                Tu aporte ha sido sumado al conteo en vivo de 200 piezas y aparecerá en el registro del movimiento. El 100% de los fondos están siendo canalizados a las brigadas de emergencia.
              </p>
            </div>

            <div className="p-4 bg-[#1a221a] border border-[#46464d] text-left text-[13px] font-mono-tag space-y-1">
              <p className="text-[#e9c349] font-bold">COMPROBANTE DE COMPROMISO SOLIDARIO</p>
              <p className="text-[#c6c6ce]">Donante: <span className="text-[#dce5d9]">{donorName || 'Solidario Anónimo'}</span></p>
              <p className="text-[#c6c6ce]">Mensaje: <span className="text-[#dce5d9] italic">"{message || 'Unidos por Colombia.'}"</span></p>
              <p className="text-[#c6c6ce]">Fecha: <span className="text-[#dce5d9]">{new Date().toLocaleDateString('es-CO')}</span></p>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3.5 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold uppercase text-[13px] tracking-wider hover:bg-[#ffe088] transition-colors cursor-pointer"
            >
              Volver al sitio
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#46464d] pb-4">
              <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#e9c349]" /> 100% Destinado a la Causa
              </span>
              <h3 className="font-anybody text-[24px] md:text-[28px] font-bold text-[#dce5d9] uppercase tracking-tight">
                Únete y Sé Parte del Cambio
              </h3>
              <p className="text-[14px] text-[#c6c6ce]">
                Adquiere una de las 200 piezas seriadas o realiza una contribución directa a las brigadas de rescate.
              </p>
            </div>

            {/* Type Switcher */}
            <div className="grid grid-cols-2 gap-2 border border-[#46464d] p-1 bg-[#1a221a]">
              <button
                type="button"
                onClick={() => setActionType('piece')}
                className={`py-2 text-[12px] font-mono-tag font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  actionType === 'piece'
                    ? 'bg-[#e9c349] text-[#241a00]'
                    : 'text-[#c6c6ce] hover:text-[#dce5d9]'
                }`}
              >
                Adquirir Pieza Seriada
              </button>
              <button
                type="button"
                onClick={() => setActionType('donation')}
                className={`py-2 text-[12px] font-mono-tag font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                  actionType === 'donation'
                    ? 'bg-[#e9c349] text-[#241a00]'
                    : 'text-[#c6c6ce] hover:text-[#dce5d9]'
                }`}
              >
                Aporte Directo
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {actionType === 'piece' ? (
                <>
                  {/* Piece Selection */}
                  <div className="space-y-2">
                    <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                      Selecciona tu pieza (#{currentPiece.editionNumber} de 200)
                    </label>
                    <select
                      value={selectedPieceId}
                      onChange={(e) => setSelectedPieceId(e.target.value)}
                      className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] font-mono-tag text-[13px] p-3 focus:border-[#e9c349] focus:outline-none"
                    >
                      {COLLECTION_PIECES.map((piece) => (
                        <option key={piece.id} value={piece.id} className="bg-[#161d16] text-[#dce5d9]">
                          {piece.tag} - {piece.name} (${piece.priceUSD} USD / ${piece.priceCOP.toLocaleString()} COP)
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Size Selection */}
                  <div className="space-y-2">
                    <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                      Talla
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {['S', 'M', 'L', 'XL'].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setSize(s)}
                          className={`py-2.5 font-mono-tag text-[13px] font-bold border transition-colors cursor-pointer ${
                            size === s
                              ? 'border-[#e9c349] bg-[#e9c349] text-[#241a00]'
                              : 'border-[#46464d] bg-[#1a221a] text-[#dce5d9] hover:border-[#c6c6ce]'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                /* Direct Donation amounts */
                <div className="space-y-2">
                  <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                    Monto de solidaridad (USD)
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[15, 30, 50, 100].map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomAmount(amt)}
                        className={`py-2.5 font-mono-tag text-[13px] font-bold border transition-colors cursor-pointer ${
                          customAmount === amt
                            ? 'border-[#e9c349] bg-[#e9c349] text-[#241a00]'
                            : 'border-[#46464d] bg-[#1a221a] text-[#dce5d9] hover:border-[#c6c6ce]'
                        }`}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Donor Name */}
              <div className="space-y-2">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                  Tu Nombre (Aparecerá en el feed en vivo)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo Gómez o Anónimo"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                />
              </div>

              {/* Message of Solidarity */}
              <div className="space-y-2">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                  Mensaje de Apoyo (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Fuerza Cartagena, juntos salimos adelante."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={100}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                />
              </div>

              <div className="p-3 bg-[#1a221a] border border-[#46464d] flex items-center gap-2.5 text-[12px] text-[#c6c6ce]">
                <ShieldCheck className="w-4 h-4 text-[#e9c349] flex-shrink-0" />
                <span>Garantía de transparencia: reporte de auditoría público por OSANELI.</span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold text-[13px] uppercase tracking-wider hover:bg-[#ffe088] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>Confirmar y Unirme al Movimiento</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
