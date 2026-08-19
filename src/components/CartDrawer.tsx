import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
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
  const [buyerEmail, setBuyerEmail] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const subtotalUSD = items.reduce((acc, item) => acc + item.piece.priceUSD * item.quantity, 0);
  const subtotalCOP = items.reduce((acc, item) => acc + item.piece.priceCOP * item.quantity, 0);

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = buyerName.trim() || 'Comprador Solidario';
    onCheckoutSuccess(finalName, `Apoyo con ${items.length} piezas solidarias.`);
    setIsSuccess(true);
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
            className="text-[#c6c6ce] hover:text-[#e9c349] transition-colors p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {isSuccess ? (
          <div className="flex-1 flex flex-col justify-center items-center text-center py-10 space-y-5">
            <div className="w-16 h-16 rounded-full bg-[#e9c349]/10 border border-[#e9c349] text-[#e9c349] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-anybody text-[24px] font-bold text-[#dce5d9] uppercase">
              ¡Orden Confirmada!
            </h4>
            <p className="text-[14px] text-[#c6c6ce] leading-relaxed">
              Gracias por unirte a OSANELI. Hemos registrado tu pedido y el 100% de las ganancias están comprometidas a las brigadas de auxilio en Colombia.
            </p>
            <div className="p-4 bg-[#1a221a] border border-[#46464d] text-left text-[12px] font-mono-tag w-full space-y-1">
              <p className="text-[#e9c349] font-bold">DETALLE DE ORDEN</p>
              <p className="text-[#c6c6ce]">Beneficiario: <span className="text-[#dce5d9]">{buyerName || 'Comprador Solidario'}</span></p>
              <p className="text-[#c6c6ce]">Email: <span className="text-[#dce5d9]">{buyerEmail || 'contacto@solidaridad.co'}</span></p>
              <p className="text-[#c6c6ce]">Monto Total: <span className="text-[#e9c349] font-bold">${subtotalUSD} USD</span></p>
            </div>
            <button
              onClick={handleFinish}
              className="w-full py-3.5 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold uppercase text-[12px] tracking-wider hover:bg-[#ffe088] transition-colors cursor-pointer"
            >
              Completar y Cerrar
            </button>
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
                    Elige una de las 200 piezas seriadas para apoyar la iniciativa.
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
                        className="text-[#c6c6ce] hover:text-red-400 p-1"
                        aria-label="Eliminar prenda"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-[#46464d]/60">
                      <div className="flex items-center border border-[#46464d] bg-[#161d16]">
                        <button
                          onClick={() => onUpdateQuantity(item.piece.id, item.size, -1)}
                          className="px-2 py-1 text-[13px] hover:text-[#e9c349] font-mono-tag"
                        >
                          -
                        </button>
                        <span className="px-3 py-1 font-mono-tag text-[12px] font-bold text-[#dce5d9]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => onUpdateQuantity(item.piece.id, item.size, 1)}
                          className="px-2 py-1 text-[13px] hover:text-[#e9c349] font-mono-tag"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="font-mono-tag font-bold text-[14px] text-[#e9c349]">
                          ${item.piece.priceUSD * item.quantity} USD
                        </div>
                        <div className="font-mono-tag text-[10px] text-[#c6c6ce]">
                          ≈ ${(item.piece.priceCOP * item.quantity).toLocaleString()} COP
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
                    <span className="text-[#dce5d9] font-bold">${subtotalUSD} USD</span>
                  </div>
                  <div className="flex justify-between text-[#c6c6ce]">
                    <span>Fondo de Solidaridad</span>
                    <span className="text-[#e9c349] font-bold">100% INCLUIDO</span>
                  </div>
                  <div className="flex justify-between text-[16px] font-bold pt-2 border-t border-[#46464d] text-[#dce5d9]">
                    <span>Total a Contribuir</span>
                    <span className="text-[#e9c349]">${subtotalUSD} USD</span>
                  </div>
                </div>

                {/* Checkout Quick Fields */}
                <form onSubmit={handleCheckout} className="space-y-3">
                  <input
                    type="text"
                    required
                    placeholder="Tu nombre completo"
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Correo electrónico para certificado"
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    className="w-full bg-[#1a221a] border border-[#46464d] text-[#dce5d9] p-2.5 text-[13px] focus:border-[#e9c349] focus:outline-none"
                  />

                  <div className="p-2.5 bg-[#1a221a] border border-[#46464d] flex items-center gap-2 text-[11px] text-[#c6c6ce]">
                    <ShieldCheck className="w-4 h-4 text-[#e9c349] flex-shrink-0" />
                    <span>Envío internacional garantizado y trazabilidad de fondos.</span>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold text-[13px] uppercase tracking-wider hover:bg-[#ffe088] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <span>Proceder al Pago Solidario</span>
                    <ArrowRight className="w-4 h-4" />
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
