import React from 'react';
import { X, CheckCircle2, TrendingUp, PackageCheck, Truck, Users } from 'lucide-react';

interface ImpactReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCount: number;
  totalCount?: number;
}

export const ImpactReportModal: React.FC<ImpactReportModalProps> = ({
  isOpen,
  onClose,
  currentCount,
  totalCount = 200,
}) => {
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
              Trazabilidad en Tiempo Real
            </span>
            <h3 className="font-anybody text-[26px] font-bold text-[#dce5d9] uppercase tracking-tight mt-1">
              Impact Report · Cartagena 2026
            </h3>
            <p className="text-[14px] text-[#c6c6ce] mt-1">
              Actualización del destino de los fondos recaudados a través de las {totalCount} piezas.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3.5 bg-[#1a221a] border border-[#46464d]">
              <span className="font-mono-tag text-[10px] text-[#c6c6ce] uppercase">Piezas Alcanzadas</span>
              <p className="font-anybody text-[24px] font-bold text-[#e9c349]">{currentCount} / {totalCount}</p>
            </div>
            <div className="p-3.5 bg-[#1a221a] border border-[#46464d]">
              <span className="font-mono-tag text-[10px] text-[#c6c6ce] uppercase">Familias Asistidas</span>
              <p className="font-anybody text-[24px] font-bold text-[#dce5d9]">320+</p>
            </div>
            <div className="p-3.5 bg-[#1a221a] border border-[#46464d] col-span-2 sm:col-span-1">
              <span className="font-mono-tag text-[10px] text-[#c6c6ce] uppercase">Brigadas Equipadas</span>
              <p className="font-anybody text-[24px] font-bold text-[#dce5d9]">14 Equipos</p>
            </div>
          </div>

          {/* Fund Breakdown Distribution */}
          <div className="space-y-3">
            <h4 className="font-mono-tag text-[12px] uppercase text-[#e9c349] font-bold tracking-wider">
              Distribución de Fondos
            </h4>
            
            <div className="space-y-2">
              <div className="p-3 bg-[#1a221a] border border-[#46464d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <PackageCheck className="w-5 h-5 text-[#e9c349]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#dce5d9]">Equipos de Protección y Primeros Auxilios</p>
                    <p className="text-[11px] text-[#c6c6ce]">Cascos, linternas tácticas, camillas y botiquines de trauma</p>
                  </div>
                </div>
                <span className="font-mono-tag font-bold text-[#e9c349]">45%</span>
              </div>

              <div className="p-3 bg-[#1a221a] border border-[#46464d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-[#e9c349]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#dce5d9]">Materiales de Reconstrucción de Techos</p>
                    <p className="text-[11px] text-[#c6c6ce]">Láminas de zinc, maderas tratadas y herramientas pesadas</p>
                  </div>
                </div>
                <span className="font-mono-tag font-bold text-[#e9c349]">35%</span>
              </div>

              <div className="p-3 bg-[#1a221a] border border-[#46464d] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-[#e9c349]" />
                  <div>
                    <p className="text-[13px] font-bold text-[#dce5d9]">Kits de Alimentación y Agua Potable</p>
                    <p className="text-[11px] text-[#c6c6ce]">Filtros purificadores y raciones secas de emergencia</p>
                  </div>
                </div>
                <span className="font-mono-tag font-bold text-[#e9c349]">20%</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#1a221a] border border-[#46464d] text-[12px] text-[#c6c6ce] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Auditoría independiente con código abierto y actas notariales de entrega.</span>
          </div>

          <button
            onClick={onClose}
            className="w-full py-3.5 bg-[#e9c349] text-[#241a00] font-mono-tag font-bold uppercase text-[12px] tracking-wider hover:bg-[#ffe088] transition-colors cursor-pointer"
          >
            Cerrar Reporte
          </button>
        </div>
      </div>
    </div>
  );
};
