import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, MessageCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, size: string, delta: number) => void;
  onRemoveItem: (id: string, size: string) => void;
  onClearCart: () => void;
  onCheckoutSuccess: (donorName: string, message: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckoutSuccess,
}) => {
  const [buyerName, setBuyerName] = useState('');
  const [docType, setDocType] = useState('CC');
  const [docNumber, setDocNumber] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [city, setCity] = useState('Cartagena');
  const [address, setAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

  if (!isOpen) return null;

  const subtotalCOP = items.reduce((acc, item) => acc + item.piece.priceCOP * item.quantity, 0);
  const WHATSAPP_NUMBER = '573236737646';

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = buyerName.trim() || 'Comprador Solidario';

    // Construct items bullet points
    const itemsList = items
      .map(
        (item, idx) =>
          `${idx + 1}. *${item.piece.name}* (Talla ${item.size}) x ${item.quantity} - COP $${(item.piece.priceCOP * item.quantity).toLocaleString()}`
      )
      .join('\n');

    const messageText =
      `¡Hola OSANELI! Deseo confirmar mi pedido solidario para Cartagena 2026:\n\n` +
      `*Datos del Comprador:*\n` +
      `• *Nombre:* ${finalName}\n` +
      `• *Documento:* ${docType} ${docNumber.trim()}\n` +
      `• *Teléfono:* ${phoneNumber.trim()}\n` +
      `• *Ciudad:* ${city.trim() || 'Cartagena'}\n` +
      `• *Dirección de Entrega:* ${address.trim()}\n` +
      (orderNotes.trim() ? `• *Notas:* ${orderNotes.trim()}\n\n` : '\n') +
      `*Resumen del Pedido:*\n` +
      `${itemsList}\n\n` +
      `*Total a Pagar:* COP $${subtotalCOP.toLocaleString()}\n\n` +
      `Quedo atento a las instrucciones para efectuar el pago y la entrega. ¡Gracias!`;

    const generatedUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(messageText)}`;
    setWhatsappUrl(generatedUrl);

    onCheckoutSuccess(finalName, `Adquirió ${items.length} piezas solidarias para Cartagena.`);
    setIsSuccess(true);

    try {
      window.open(generatedUrl, '_blank');
    } catch {
      // Handled by UI button
    }
  };

  const handleFinish = () => {
    setIsSuccess(false);
    onClearCart();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-xs animate-fade-in">
      <div
        id="shopping-bag-drawer"
        className="w-full max-w-md bg-[#161d16] border-l border-[#46464d] h-full flex flex-col justify-between text-[#dce5d9] p-6 shadow-2xl relative animate-slide-left overflow-y-auto custom-scrollbar"
      >
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#46464d] pb-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#e9c349]" />
            <h3 className="font-anybody font-bold text-[20px] uppercase text-[#dce5d9]">
              Bolsa Solidaria ({items.reduce((sum, i) => sum + i.quantity, 0)})
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar bolsa"
            className="text-[#c6c6ce] hover:text-[#e9c349] transition-colors p-1 cursor-pointer"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-8 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#25D366]/10 border border-[#25D366] text-[#25D366] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <h4 className="font-anybody text-[24px] font-bold text-[#dce5d9] uppercase">
                ¡Pedido Generado!
              </h4>
              <p className="text-[13px] text-[#c6c6ce] leading-relaxed">
                Tu pedido se canaliza directamente por WhatsApp al <strong className="text-[#e9c349]">+57 323 6737646</strong> para coordinar pago y entrega.
              </p>
            </div>

            <div className="p-4 bg-[#1a221a] border border-[#46464d] text-left text-[12px] font-mono-tag w-full space-y-1.5">
              <p className="text-[#e9c349] font-bold">DETALLE DE COMPRA</p>
              <p className="text-[#c6c6ce]">Comprador: <span className="text-[#dce5d9]">{buyerName || 'Comprador Solidario'}</span></p>
              <p className="text-[#c6c6ce]">Documento: <span className="text-[#dce5d9]">{docType} {docNumber}</span></p>
              <p className="text-[#c6c6ce]">Teléfono: <span className="text-[#dce5d9]">{phoneNumber}</span></p>
              <p className="text-[#c6c6ce]">Entrega: <span className="text-[#dce5d9]">{address}, {city}</span></p>
              <p className="text-[#c6c6ce]">Total: <span className="text-[#e9c349] font-bold">COP ${subtotalCOP.toLocaleString()}</span></p>
              <p className="text-[#c6c6ce]">WhatsApp: <span className="text-[#25D366] font-bold">+57 323 6737646</span></p>
            </div>

            <div className="w-full space-y-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-4 bg-[#25D366] text-[#0a1a0f] font-mono-tag font-bold uppercase text-[13px] tracking-wider hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Enviar Pedido a WhatsApp (+57 323 6737646)</span>
              </a>

              <button
                onClick={handleFinish}
                className="w-full py-3 bg-[#1a221a] border border-[#46464d] text-[#c6c6ce] hover:text-[#dce5d9] hover:border-[#e9c349] font-mono-tag font-bold uppercase text-[12px] tracking-wider transition-colors cursor-pointer"
              >
                Finalizar y Vaciar Bolsa
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {items.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-[#46464d]" />
                  <p className="font-mono-tag text-[13px] text-[#c6c6ce]">Tu bolsa está vacía.</p>
                  <p className="text-[13px] text-[#c6c6ce]/70 max-w-xs">
                    Elige la Camiseta ($120.000 COP) o el Short ($150.000 COP) de la colección Cartagena 2026 para iniciar tu orden.
                  </p>
                </div>
              ) : (
                items.map((item) => (
                  <div
                    key={`${item.piece.id}-${item.size}`}
                    className="p-4 bg-[#1a221a] border border-[#46464d] flex flex-col gap-3 relative"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-mono-tag text-[10px] text-[#e9c349] uppercase font-bold">
                          Edición #{item.piece.editionNumber} de 200
                        </span>
                        <h4 className="font-anybody text-[15px] font-bold text-[#dce5d9] leading-tight">
                          {item.piece.name}
                        </h4>
                        <span className="font-mono-tag text-[11px] text-[#c6c6ce]">
                          Talla: <span className="text-[#dce5d9] font-bold">{item.size}</span>
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.piece.id, item.size)}
                        className="text-[#c6c6ce] hover:text-red-400 p-1 cursor-pointer"
                        aria-label="Eliminar prenda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#46464d]/60">
                      <div className="flex items-center border border-[#46464d] bg-[#161d16]">
                        <button
                          onClick={() => onUpdateQuantity(item.piece.id, item.size, -1)}
                          className="px-2.5 py-1 text-[13px] hover:text-[#e9c349] font-mono-tag cursor-pointer"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-mono-tag text-[12px] font-bold text-[#dce5d9]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.piece.id, item.size, 1)}
                          className="px-2.5 py-1 text-[13px] hover:text-[#e9c349] font-mono-tag cursor-pointer"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-mono-tag font-bold text-[14px] text-[#e9c349]">
                          COP ${(item.piece.priceCOP * item.quantity).toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout */}
            {items.length > 0 && (
              <div className="border-t border-[#46464d] pt-4 space-y-4">
                <div className="space-y-1.5 text-[13px] font-mono-tag">
                  <div className="flex justify-between text-[#c6c6ce]">
                    <span>Subtotal</span>
                    <span className="text-[#dce5d9] font-bold">COP ${subtotalCOP.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[16px] font-bold pt-2 border-t border-[#46464d] text-[#dce5d9]">
                    <span>Total Pedido</span>
                    <span className="text-[#e9c349]">COP ${subtotalCOP.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Quick Fields */}
                <form onSubmit={handleCheckout} className="space-y-3">
                  <div>
                    <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                      Nombre Completo *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Tu nombre completo"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                    />
                  </div>

                  {/* Document Type and Number */}
                  <div className="grid grid-cols-5 gap-2">
                    <div className="col-span-2">
                      <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                        Tipo Doc. *
                      </label>
                      <select
                        value={docType}
                        onChange={(e) => setDocType(e.target.value)}
                        className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[12px] focus:border-[#e9c349] focus:outline-none"
                      >
                        <option value="CC">CC</option>
                        <option value="CE">CE</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="NIT">NIT</option>
                        <option value="TI">TI</option>
                      </select>
                    </div>

                    <div className="col-span-3">
                      <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                        Nº Documento *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. 1047489230"
                        value={docNumber}
                        onChange={(e) => setDocNumber(e.target.value)}
                        className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                      />
                    </div>
                  </div>

                  {/* Phone & City */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                        Teléfono / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="Ej. 300 123 4567"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                      />
                    </div>

                    <div>
                      <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                        Ciudad *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Ej. Cartagena"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                      />
                    </div>
                  </div>

                  {/* Delivery Address */}
                  <div>
                    <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                      Dirección de Entrega *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Cra. 3 #8-15, Bocagrande, Apto 402"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                    />
                  </div>

                  <div>
                    <label className="font-mono-tag text-[11px] text-[#c6c6ce] uppercase block mb-1">
                      Notas o Instrucciones (Opcional)
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Horario de entrega o referencia"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none placeholder-[#46464d]"
                    />
                  </div>

                  <div className="p-2.5 bg-[#1a221a] border border-[#46464d] flex items-center gap-2 text-[11px] text-[#c6c6ce]">
                    <ShieldCheck className="w-4 h-4 text-[#e9c349] flex-shrink-0" />
                    <span>Finalización por WhatsApp oficial: +57 323 6737646.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#25D366] text-[#0a1a0f] font-mono-tag font-bold text-[13px] uppercase tracking-wider hover:bg-[#20bd5a] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5 fill-current" />
                    <span>Finalizar Pedido por WhatsApp</span>
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
