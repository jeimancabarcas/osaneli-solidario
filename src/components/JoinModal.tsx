import React, { useState } from 'react';
import { X, Heart, ShieldCheck, CheckCircle2, MessageCircle, ArrowRight } from 'lucide-react';
import { COLLECTION_PIECES } from '../data/mockData';
import { CollectionPiece } from '../types';
import { createOrder } from '../services/firebaseService';

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
  const [docType, setDocType] = useState<string>('CC');
  const [docNumber, setDocNumber] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [city, setCity] = useState<string>('Cartagena');
  const [address, setAddress] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [whatsappUrl, setWhatsappUrl] = useState<string>('');

  if (!isOpen) return null;

  const currentPiece = COLLECTION_PIECES.find((p) => p.id === selectedPieceId) || COLLECTION_PIECES[0];
  const WHATSAPP_NUMBER = '573236737646';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = donorName.trim() || 'Solidario Anónimo';
    const finalMessage = message.trim();
    const itemSupported = `${currentPiece.name} (Talla ${size})`;

    const textToSend =
      `¡Hola OSANELI! Deseo adquirir una pieza de la colección solidaria Cartagena 2026:\n\n` +
      `• *Pieza:* ${currentPiece.name}\n` +
      `• *Talla:* ${size}\n` +
      `• *Precio:* COP $${currentPiece.priceCOP.toLocaleString()}\n\n` +
      `*Datos del Comprador:*\n` +
      `• *Nombre:* ${finalName}\n` +
      `• *Documento:* ${docType} ${docNumber.trim()}\n` +
      `• *Teléfono:* ${phoneNumber.trim()}\n` +
      `• *Ciudad:* ${city.trim() || 'Cartagena'}\n` +
      `• *Dirección de Entrega:* ${address.trim()}\n` +
      (finalMessage ? `• *Mensaje de apoyo:* "${finalMessage}"\n\n` : '\n') +
      `Deseo coordinar el pago y recibir mi pieza seriada. ¡Gracias!`;

    const generatedUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(textToSend)}`;
    setWhatsappUrl(generatedUrl);

    // Save order automatically into database in pending status
    createOrder({
      name: finalName,
      docType,
      docNumber: docNumber.trim(),
      phoneNumber: phoneNumber.trim(),
      city: city.trim() || 'Cartagena',
      address: address.trim(),
      message: finalMessage,
      itemSupported,
      items: [
        {
          pieceId: currentPiece.id,
          name: currentPiece.name,
          size,
          quantity: 1,
          priceCOP: currentPiece.priceCOP,
        },
      ],
      totalAmount: currentPiece.priceCOP,
    }).catch((err) => {
      console.warn('Error recording order in Firestore:', err);
    });

    onJoinSuccess(finalName, finalMessage, itemSupported);
    setIsSuccess(true);

    // Open WhatsApp in a safe window
    try {
      window.open(generatedUrl, '_blank');
    } catch {
      // Fallback handled by UI button
    }
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
          <div className="text-center py-6 space-y-6 animate-scale-up">
            <div className="w-16 h-16 bg-[#25D366]/10 border border-[#25D366] text-[#25D366] rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-2">
              <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-widest font-bold">
                Pedido Registrado · Cartagena 2026
              </span>
              <h3 className="font-anybody text-[26px] md:text-[28px] font-bold text-[#dce5d9] uppercase">
                ¡Gracias por tu Solidaridad!
              </h3>
              <p className="text-[14px] text-[#c6c6ce] max-w-md mx-auto">
                Tu pedido se finaliza a través de nuestro canal oficial de WhatsApp al número <strong className="text-[#e9c349]">+57 323 6737646</strong>.
              </p>
            </div>

            <div className="p-4 bg-[#1a221a] border border-[#46464d] text-left text-[13px] font-mono-tag space-y-1.5">
              <p className="text-[#e9c349] font-bold">RESUMEN DE ADQUISICIÓN</p>
              <p className="text-[#c6c6ce]">Prenda: <span className="text-[#dce5d9] font-bold">{currentPiece.name} (Talla {size})</span></p>
              <p className="text-[#c6c6ce]">Valor: <span className="text-[#e9c349] font-bold">COP ${currentPiece.priceCOP.toLocaleString()}</span></p>
              <p className="text-[#c6c6ce]">Comprador: <span className="text-[#dce5d9]">{donorName || 'Solidario Anónimo'}</span></p>
              <p className="text-[#c6c6ce]">Documento: <span className="text-[#dce5d9]">{docType} {docNumber}</span></p>
              <p className="text-[#c6c6ce]">Teléfono: <span className="text-[#dce5d9]">{phoneNumber}</span></p>
              <p className="text-[#c6c6ce]">Entrega: <span className="text-[#dce5d9]">{address}, {city}</span></p>
              <p className="text-[#c6c6ce]">WhatsApp Oficial: <span className="text-[#25D366] font-bold">+57 323 6737646</span></p>
            </div>

            <div className="space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] text-[#0a1a0f] font-mono-tag font-bold uppercase text-[13px] tracking-wider hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Abrir Chat de WhatsApp (+57 323 6737646)</span>
              </a>

              <button
                onClick={handleDone}
                className="w-full py-3 bg-[#1a221a] border border-[#46464d] text-[#c6c6ce] hover:text-[#dce5d9] hover:border-[#e9c349] font-mono-tag text-[12px] uppercase tracking-wider transition-colors cursor-pointer"
              >
                Volver al sitio
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-1 border-b border-[#46464d] pb-4">
              <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-[0.2em] font-bold flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-[#e9c349]" /> Edición Conmemorativa Limitada · Cartagena 2026
              </span>
              <h3 className="font-anybody text-[24px] md:text-[28px] font-bold text-[#dce5d9] uppercase tracking-tight">
                Adquirir Pieza Solidaria
              </h3>
              <p className="text-[14px] text-[#c6c6ce]">
                Elige tu prenda seriada de la colección (Camiseta o Short). El pedido se confirma directamente vía WhatsApp al <span className="text-[#e9c349] font-bold">+57 323 6737646</span>.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Piece Selection */}
              <div className="space-y-2">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                  Selecciona tu prenda
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {COLLECTION_PIECES.map((piece) => {
                    const isSelected = selectedPieceId === piece.id;
                    return (
                      <button
                        key={piece.id}
                        type="button"
                        onClick={() => setSelectedPieceId(piece.id)}
                        className={`p-3.5 text-left border transition-all cursor-pointer flex flex-col justify-between gap-1.5 ${
                          isSelected
                            ? 'border-[#e9c349] bg-[#242c24] text-[#e9c349]'
                            : 'border-[#46464d] bg-[#1a221a] text-[#c6c6ce] hover:border-[#c6c6ce]'
                        }`}
                      >
                        <span className="font-mono-tag text-[10px] uppercase font-bold text-[#e9c349]">
                          {piece.tag}
                        </span>
                        <span className="font-anybody text-[14px] font-bold text-[#dce5d9] leading-tight">
                          {piece.name}
                        </span>
                        <span className="font-mono-tag text-[13px] text-[#e9c349] font-bold">
                          COP ${piece.priceCOP.toLocaleString()}
                        </span>
                      </button>
                    );
                  })}
                </div>
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

              {/* Buyer Name */}
              <div className="space-y-1.5">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Mateo Gómez García"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                />
              </div>

              {/* Document Type and Document Number */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                    Tipo Doc. *
                  </label>
                  <select
                    value={docType}
                    onChange={(e) => setDocType(e.target.value)}
                    className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none"
                  >
                    <option value="CC">Cédula de Ciudadanía (CC)</option>
                    <option value="CE">Cédula de Extranjería (CE)</option>
                    <option value="Pasaporte">Pasaporte</option>
                    <option value="NIT">NIT</option>
                    <option value="TI">Tarjeta de Identidad (TI)</option>
                  </select>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                    Número de Documento *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. 1047489230"
                    value={docNumber}
                    onChange={(e) => setDocNumber(e.target.value)}
                    className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                  />
                </div>
              </div>

              {/* Phone Number and City */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                    Número de Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej. 300 123 4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                    Ciudad *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Cartagena"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                  />
                </div>
              </div>

              {/* Delivery Address */}
              <div className="space-y-1.5">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                  Dirección de Entrega *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Cra. 3 #8-15, Barrio Bocagrande, Edificio Caribe Apto 402"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                />
              </div>

              {/* Message of Solidarity */}
              <div className="space-y-1.5">
                <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase tracking-wider block">
                  Mensaje de Solidaridad (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ej. Fuerza Cartagena, unidos salimos adelante."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  maxLength={100}
                  className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-3 text-[14px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                />
              </div>

              <div className="p-3 bg-[#1a221a] border border-[#46464d] flex items-center gap-2.5 text-[12px] text-[#c6c6ce]">
                <ShieldCheck className="w-4 h-4 text-[#e9c349] flex-shrink-0" />
                <span>Finalización segura mediante WhatsApp directo (+57 323 6737646).</span>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-[#25D366] text-[#0a1a0f] font-mono-tag font-bold text-[13px] uppercase tracking-wider hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Confirmar Pedido por WhatsApp</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
