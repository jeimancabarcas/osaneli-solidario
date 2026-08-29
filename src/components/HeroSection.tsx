import React from 'react';
import { ArrowRight, User, Heart, Sparkles } from 'lucide-react';
import { Donor } from '../types';
import { IMAGES } from '../data/mockData';

interface HeroSectionProps {
  donors: Donor[];
  currentCount: number | null;
  totalCount: number;
  isLoadingCampaign?: boolean;
  isLoadingDonors?: boolean;
  onOpenJoinModal: () => void;
  onOpenImageLightbox: (url: string, title: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  donors,
  currentCount,
  totalCount,
  isLoadingCampaign = false,
  isLoadingDonors = false,
  onOpenJoinModal,
  onOpenImageLightbox,
}) => {
  const isCountLoading = isLoadingCampaign || currentCount === null;
  const safeCount = typeof currentCount === 'number' ? Math.max(0, currentCount) : 0;
  const safeTotal = typeof totalCount === 'number' && totalCount > 0 ? totalCount : 200;
  const percentage = Math.min(100, Math.max(0, Math.round((safeCount / safeTotal) * 100)));

  return (
    <section id="hero-section" className="w-full pt-28 md:pt-36 pb-12 md:pb-20">
      {/* Primary Headline */}
      <div className="text-center mb-8 md:mb-16">
        <h1
          id="main-headline"
          className="font-anybody font-extrabold text-[44px] sm:text-[60px] lg:text-[80px] leading-[0.95] text-[#dce5d9] uppercase tracking-[-0.03em] md:tracking-[-0.04em] transition-all"
        >
          TODOS SOMOS <span className="text-[#e9c349] block sm:inline">COLOMBIA</span>
        </h1>
      </div>

      {/* Desktop 12-Column Grid (Hidden on small mobile, visible from lg) */}
      <div className="hidden lg:grid lg:grid-cols-12 gap-8 items-stretch">
        {/* Left Column: Manifesto, Impact Tracker & CTA (5 cols) */}
        <div id="hero-left-column" className="lg:col-span-5 flex flex-col justify-between gap-8">
          <div className="space-y-5 text-[#dce5d9]">
            <p className="text-[17px] leading-[26px] text-[#dce5d9]/90 font-normal">
              Colombia está pasando por un momento que nos invita a unirnos. En OSANELI creemos en el poder de la comunidad y en la acción tangible.
            </p>
            <p className="text-[19px] leading-[28px] font-bold text-[#dce5d9] tracking-tight">
              Estamos creando 200 piezas con un propósito.
            </p>
            <p className="text-[15px] leading-[24px] text-[#c6c6ce]">
              Esta no es solo una colección; es un movimiento de solidaridad. Cada pieza representa un compromiso directo con el cambio y la resiliencia comunitaria en Cartagena 2026.
            </p>
          </div>

          {/* Impact Tracker Box */}
          <div
            id="impact-tracker-box"
            className="bg-[#1a221a] border border-[#46464d] p-6 rounded-none space-y-4 shadow-sm hover:border-[#e9c349]/50 transition-colors"
          >
            <div className="flex justify-between items-baseline border-b border-[#46464d]/60 pb-3">
              <span className="font-mono-tag text-[12px] tracking-[0.15em] text-[#e9c349] uppercase font-semibold">
                Impacto Real
              </span>
              <div className="flex items-baseline gap-1">
                {isCountLoading ? (
                  <div className="flex items-center gap-1.5 py-1">
                    <div className="h-7 w-16 bg-[#2f372f] animate-pulse rounded-xs" />
                    <span className="font-anybody text-[20px] text-[#c6c6ce] leading-none">/{totalCount}</span>
                  </div>
                ) : (
                  <>
                    <span className="font-anybody font-bold text-[32px] text-[#dce5d9] leading-none animate-fade-in">
                      {currentCount}
                    </span>
                    <span className="font-anybody text-[20px] text-[#c6c6ce] leading-none">
                      /{totalCount}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Progress Bar with pulse or skeleton */}
            {isCountLoading ? (
              <div className="h-3 w-full bg-[#242c24] overflow-hidden relative">
                <div className="h-full w-2/4 bg-[#2f372f] animate-pulse" />
              </div>
            ) : (
              <div className="h-3 w-full bg-[#2f372f] overflow-hidden relative">
                <div
                  className="h-full bg-[#e9c349] progress-pulse transition-all duration-700 ease-out"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}

            <div className="flex justify-between text-[#c6c6ce] text-[12px] font-mono-tag tracking-wider items-center">
              <span>Piezas con propósito</span>
              {isCountLoading ? (
                <div className="h-4 w-28 bg-[#2f372f] animate-pulse rounded-xs" />
              ) : (
                <span className="text-[#e9c349] font-bold">{percentage}% Completado</span>
              )}
            </div>
          </div>

          {/* Main Action Button */}
          <button
            id="btn-join-movement-desktop"
            onClick={onOpenJoinModal}
            className="w-full py-4 px-6 bg-[#e9c349] text-[#241a00] font-mono-tag text-[13px] uppercase font-bold tracking-[0.12em] hover:bg-[#ffe088] active:scale-[0.99] transition-all flex items-center justify-center gap-3 group shadow-md cursor-pointer"
          >
            <span>Únete y sé parte del cambio con propósito</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Center Column: Solidarity Fist Visual Identity (4 cols) */}
        <div
          id="hero-center-column"
          className="lg:col-span-4 flex items-center justify-center bg-[#161d16] border border-[#46464d] p-6 relative overflow-hidden group cursor-pointer"
          onClick={() => onOpenImageLightbox(IMAGES.fistLogo, 'Identidad de Solidaridad - OSANELI')}
          title="Click para ver en alta resolución"
        >
          {/* Subtle background glow effect */}
          <div className="absolute inset-0 bg-radial from-[#e9c349]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <img
            src={IMAGES.fistLogo}
            alt="Emblema de Solidaridad Puño OSANELI"
            referrerPolicy="no-referrer"
            className="w-full max-w-[280px] h-auto object-contain transition-transform duration-500 group-hover:scale-105 filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
          />

          <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity font-mono-tag text-[10px] text-[#c6c6ce] bg-[#0d150f]/80 px-2 py-1 border border-[#46464d]">
            EXPANDIR +
          </div>
        </div>

        {/* Right Column: Live Donors / Movimiento (3 cols) */}
        <div id="hero-right-column" className="lg:col-span-3 flex flex-col h-full">
          <div className="border border-[#46464d] bg-[#1a221a] flex flex-col h-full">
            {/* Live Header */}
            <div className="p-4 border-b border-[#46464d] flex justify-between items-center bg-[#242c24]">
              <span className="font-mono-tag text-[12px] uppercase font-bold text-[#dce5d9] tracking-[0.1em]">
                Movimiento
              </span>
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#e9c349] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#e9c349]"></span>
                </span>
                <span className="font-mono-tag text-[11px] font-bold text-[#e9c349] tracking-wider">
                  LIVE
                </span>
              </div>
            </div>

            {/* Live Donors List / Skeleton */}
            <div className="flex-grow p-4 overflow-y-auto space-y-4 max-h-[380px] custom-scrollbar mask-image-bottom">
              {isLoadingDonors && donors.length === 0 ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex items-start gap-3 animate-pulse">
                      <div className="w-8 h-8 rounded-full bg-[#2f372f] flex-shrink-0" />
                      <div className="flex-1 space-y-1.5 py-1">
                        <div className="h-3.5 bg-[#2f372f] rounded-xs w-3/4" />
                        <div className="h-2.5 bg-[#242c24] rounded-xs w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : donors.length === 0 ? (
                <div className="py-8 text-center text-[12px] text-[#c6c6ce] font-mono-tag">
                  Sé el primero en unirte al movimiento.
                </div>
              ) : (
                donors.map((donor, idx) => (
                  <div
                    key={donor.id}
                    className={`flex items-start gap-3 transition-opacity duration-300 ${
                      idx === 0 ? 'opacity-100' : idx === 1 ? 'opacity-90' : idx === 2 ? 'opacity-70' : 'opacity-50'
                    }`}
                  >
                    <div className="w-8 h-8 rounded-full bg-[#2f372f] border border-[#46464d] flex-shrink-0 flex items-center justify-center text-[#e9c349]">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-[#dce5d9] leading-tight truncate">
                        {donor.name} se unió al movimiento
                      </p>
                      {donor.message && (
                        <p className="text-[12px] text-[#c6c6ce]/80 italic mt-0.5 line-clamp-1">
                          "{donor.message}"
                        </p>
                      )}
                      <p className="font-mono-tag text-[10px] text-[#c6c6ce]/60 mt-1 uppercase tracking-wider">
                        {donor.timeAgo}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Action in Card */}
            <div className="p-3 border-t border-[#46464d] bg-[#161d16]">
              <button
                onClick={onOpenJoinModal}
                className="w-full py-2 px-3 text-[11px] font-mono-tag font-bold uppercase tracking-wider text-[#e9c349] hover:text-[#241a00] hover:bg-[#e9c349] border border-[#e9c349]/40 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>+ Unirme al movimiento</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile & Tablet Stacked View (< lg) */}
      <div className="lg:hidden flex flex-col gap-6">
        {/* Banner with Fist Image and Quote Overlay */}
        <div
          className="relative w-full aspect-square sm:aspect-video overflow-hidden border border-[#46464d] bg-[#1a221a] cursor-pointer"
          onClick={() => onOpenImageLightbox(IMAGES.fistAlt || IMAGES.fistLogo, 'OSANELI - Todos Somos Colombia')}
        >
          <img
            src={IMAGES.fistLogo}
            alt="Emblema de Solidaridad OSANELI"
            className="absolute inset-0 w-full h-full object-contain p-6 mix-blend-screen opacity-70"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d150f] via-transparent to-transparent opacity-90" />
          <div className="absolute bottom-0 left-0 p-4 sm:p-6 w-full">
            <p className="text-[14px] sm:text-[16px] leading-[22px] sm:leading-[24px] text-[#dce5d9] bg-[#0d150f]/85 p-4 border border-[#46464d] backdrop-blur-sm">
              "Colombia está pasando por un momento que nos invita a unirnos... Desde OSANELI queremos transformar nuestra voz en acción. Estamos creando 200 piezas con un propósito."
            </p>
          </div>
        </div>

        {/* Impact Tracker Mobile */}
        <div className="bg-[#1a221a] border border-[#46464d] p-5 space-y-3">
          <div className="flex justify-between items-baseline border-b border-[#46464d]/60 pb-2">
            <span className="font-mono-tag text-[12px] tracking-[0.15em] text-[#e9c349] uppercase font-bold">
              Impacto Real
            </span>
            <div className="flex items-baseline gap-1">
              {isCountLoading ? (
                <div className="flex items-center gap-1.5 py-0.5">
                  <div className="h-6 w-14 bg-[#2f372f] animate-pulse rounded-xs" />
                  <span className="font-anybody text-[18px] text-[#c6c6ce] leading-none">/{totalCount}</span>
                </div>
              ) : (
                <>
                  <span className="font-anybody font-bold text-[28px] text-[#e9c349] leading-none animate-fade-in">
                    {currentCount}
                  </span>
                  <span className="font-anybody text-[18px] text-[#c6c6ce] leading-none">
                    /{totalCount}
                  </span>
                </>
              )}
            </div>
          </div>

          {isCountLoading ? (
            <div className="h-3 w-full bg-[#242c24] overflow-hidden relative">
              <div className="h-full w-2/4 bg-[#2f372f] animate-pulse" />
            </div>
          ) : (
            <div className="h-3 w-full bg-[#2f372f] overflow-hidden relative">
              <div
                className="h-full bg-[#e9c349] progress-pulse"
                style={{ width: `${percentage}%` }}
              />
            </div>
          )}

          <div className="flex justify-between text-[#c6c6ce] text-[11px] font-mono-tag items-center">
            <span>Piezas con propósito</span>
            {isCountLoading ? (
              <div className="h-3.5 w-24 bg-[#2f372f] animate-pulse rounded-xs" />
            ) : (
              <span className="text-[#e9c349] font-bold">{percentage}% Completado</span>
            )}
          </div>
        </div>

        {/* Live Donors Mobile Strip */}
        <div className="border border-[#46464d] bg-[#161d16] p-4">
          <div className="flex justify-between items-center border-b border-[#46464d] pb-2 mb-3">
            <span className="font-mono-tag text-[11px] text-[#e9c349] uppercase font-bold flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb4ab] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ffb4ab]"></span>
              </span>
              Donantes en vivo
            </span>
            <span className="font-mono-tag text-[10px] text-[#c6c6ce]">
              {isLoadingDonors ? 'Cargando...' : `${donors.length} registrados`}
            </span>
          </div>

          <div className="space-y-2.5 max-h-36 overflow-y-auto custom-scrollbar">
            {isLoadingDonors && donors.length === 0 ? (
              <div className="space-y-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-2.5 animate-pulse">
                    <div className="w-3.5 h-3.5 rounded-full bg-[#2f372f]" />
                    <div className="h-3 bg-[#2f372f] rounded-xs w-2/3" />
                    <div className="h-2.5 bg-[#242c24] rounded-xs w-12 ml-auto" />
                  </div>
                ))}
              </div>
            ) : donors.length === 0 ? (
              <div className="py-2 text-[12px] text-[#c6c6ce] font-mono-tag">
                Sé el primero en unirte al movimiento.
              </div>
            ) : (
              donors.slice(0, 4).map((donor) => (
                <div key={donor.id} className="flex items-center gap-2.5 text-[13px] text-[#dce5d9]">
                  <Heart className="w-3.5 h-3.5 text-[#e9c349] fill-[#e9c349] flex-shrink-0" />
                  <span className="truncate">{donor.name} se unió al movimiento</span>
                  <span className="text-[10px] font-mono-tag text-[#c6c6ce] ml-auto flex-shrink-0">{donor.timeAgo}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* CTA Button Mobile */}
        <button
          id="btn-join-movement-mobile"
          onClick={onOpenJoinModal}
          className="w-full py-4 px-5 bg-[#e9c349] text-[#241a00] font-mono-tag text-[12px] uppercase font-bold tracking-[0.1em] hover:bg-[#ffe088] transition-colors flex items-center justify-center gap-2 shadow-lg cursor-pointer"
        >
          <span>ÚNETE Y SÉ PARTE DEL CAMBIO CON PROPÓSITO</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </section>
  );
};
