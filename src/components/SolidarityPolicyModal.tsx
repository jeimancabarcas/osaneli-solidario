import React from 'react';
import { X, ShieldCheck, HeartHandshake, CheckCircle2, Lock } from 'lucide-react';

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SolidarityPolicyModal: React.FC<PolicyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#161d16] border border-[#46464d] w-full max-w-2xl text-[#dce5d9] p-6 md:p-8 relative shadow-2xl overflow-y-auto max-h-[85vh] custom-scrollbar">
        <button
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-5 text-[#c6c6ce] hover:text-[#e9c349] transition-colors p-1"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="space-y-6">
          <div className="border-b border-[#46464d] pb-4">
            <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase tracking-[0.2em] font-bold">
              Compromiso Institucional
            </span>
            <h3 className="font-anybody text-[26px] font-bold text-[#dce5d9] uppercase tracking-tight mt-1">
              Solidarity Policy (Política de Solidaridad)
            </h3>
            <p className="text-[14px] text-[#c6c6ce] mt-1">
              Marco de transparencia, gestión de fondos y destino de la iniciativa Todos Somos Colombia.
            </p>
          </div>

          <div className="space-y-4 text-[14px] leading-relaxed text-[#c6c6ce]">
            <div className="p-4 bg-[#1a221a] border border-[#46464d] space-y-2">
              <h4 className="font-anybody text-[16px] text-[#e9c349] font-bold uppercase flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> 1. Adquisición y Propósito Solidario
              </h4>
              <p>
                La adquisición de las piezas seriadas de la colección (Camiseta $120.000 COP y Short $150.000 COP en Cartagena 2026) apoya directamente la causa comunitaria. Los pedidos se gestionan de forma personalizada y directa a través del canal oficial de WhatsApp (+57 323 6737646).
              </p>
            </div>

            <div className="p-4 bg-[#1a221a] border border-[#46464d] space-y-2">
              <h4 className="font-anybody text-[16px] text-[#e9c349] font-bold uppercase flex items-center gap-2">
                <HeartHandshake className="w-4 h-4" /> 2. Limitación Estricta a 200 Piezas
              </h4>
              <p>
                Para garantizar autenticidad y trazabilidad rigurosa, cada prenda está numerada correlativamente del #001 al #200. No se fabricarán reproducciones posteriores una vez agotada la cuota.
              </p>
            </div>

            <div className="p-4 bg-[#1a221a] border border-[#46464d] space-y-2">
              <h4 className="font-anybody text-[16px] text-[#e9c349] font-bold uppercase flex items-center gap-2">
                <Lock className="w-4 h-4" /> 3. Auditoría Abierta y Recibos Públicos
              </h4>
              <p>
                Los comprobantes de compra de suministros médicos, materiales para techos, alimentos no perecederos y herramientas de rescate se publican semanalmente en el Impact Report digital para consulta ciudadana.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold uppercase text-[12px] tracking-wider hover:bg-[#ffe088] transition-colors cursor-pointer"
          >
            Entendido y Aceptado
          </button>
        </div>
      </div>
    </div>
  );
};
