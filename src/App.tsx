import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { ContextSection } from './components/ContextSection';
import { Footer } from './components/Footer';
import { JoinModal } from './components/JoinModal';
import { CartDrawer } from './components/CartDrawer';
import { MenuDrawer } from './components/MenuDrawer';
import { LightboxModal } from './components/LightboxModal';
import { SolidarityPolicyModal } from './components/SolidarityPolicyModal';
import { ImpactReportModal } from './components/ImpactReportModal';
import { ContactModal } from './components/ContactModal';
import { AdminPanel } from './components/AdminPanel';
import { Donor, CartItem, CollectionPiece } from './types';
import {
  subscribeToDonors,
  subscribeToCampaign,
} from './services/firebaseService';

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  const search = new URLSearchParams(window.location.search);

  return (
    path.startsWith('/admin') ||
    hash === '#admin' ||
    hash === '#/admin' ||
    hash.includes('admin') ||
    search.get('admin') === 'true' ||
    search.get('page') === 'admin'
  );
}

export default function App() {
  // Navigation / Route state
  const [isAdminRoute, setIsAdminRoute] = useState<boolean>(() => checkIsAdminRoute());

  const [donors, setDonors] = useState<Donor[]>([]);
  const [currentCount, setCurrentCount] = useState<number | null>(null);
  const [totalCount, setTotalCount] = useState<number>(200);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState<boolean>(true);
  const [isLoadingDonors, setIsLoadingDonors] = useState<boolean>(true);

  // Cart state - empty by default
  const [cart, setCart] = useState<CartItem[]>([]);

  // Modal controls
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [selectedPieceForJoin, setSelectedPieceForJoin] = useState<CollectionPiece | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPolicyOpen, setIsPolicyOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);

  // Lightbox state
  const [lightbox, setLightbox] = useState<{ isOpen: boolean; url: string; title: string }>({
    isOpen: false,
    url: '',
    title: '',
  });

  // Listen to URL changes for /admin
  useEffect(() => {
    const checkRoute = () => {
      setIsAdminRoute(checkIsAdminRoute());
    };

    window.addEventListener('popstate', checkRoute);
    window.addEventListener('hashchange', checkRoute);
    return () => {
      window.removeEventListener('popstate', checkRoute);
      window.removeEventListener('hashchange', checkRoute);
    };
  }, []);

  const navigateToAdmin = () => {
    try {
      window.history.pushState({}, '', '/admin');
    } catch {
      window.location.hash = 'admin';
    }
    setIsAdminRoute(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToStore = () => {
    try {
      window.history.pushState({}, '', '/');
    } catch {
      window.location.hash = '';
    }
    setIsAdminRoute(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Real-time Firestore Subscriptions for Public Store
  useEffect(() => {
    const unsubDonors = subscribeToDonors((realtimeDonors) => {
      setDonors(realtimeDonors);
      setIsLoadingDonors(false);
    });

    const unsubCampaign = subscribeToCampaign((stats) => {
      setCurrentCount(stats.currentCount);
      setTotalCount(stats.totalCount);
      setIsLoadingCampaign(false);
    });

    return () => {
      unsubDonors();
      unsubCampaign();
    };
  }, []);

  // Handle adding to cart
  const handleAddToCart = (piece: CollectionPiece, size: string) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.piece.id === piece.id && item.size === size);
      if (existing) {
        return prev.map((item) =>
          item.piece.id === piece.id && item.size === size
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { piece, size, quantity: 1 }];
    });
  };

  const handleUpdateQuantity = (id: string, size: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.piece.id === id && item.size === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string, size: string) => {
    setCart((prev) => prev.filter((item) => !(item.piece.id === id && item.size === size)));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleJoinSuccess = (_donorName: string, _message: string, _itemSupported?: string) => {
    // Registered in Firestore in pending status and dispatched to WhatsApp
  };

  const openLightbox = (url: string, title: string) => {
    setLightbox({
      isOpen: true,
      url,
      title,
    });
  };

  const closeLightbox = () => {
    setLightbox((prev) => ({ ...prev, isOpen: false }));
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // If user is accessing /admin, show full Admin Panel
  if (isAdminRoute) {
    return <AdminPanel onBackToStore={navigateToStore} />;
  }

  return (
    <div className="min-h-screen bg-[#0d150f] text-[#dce5d9] flex flex-col selection:bg-[#e9c349] selection:text-[#241a00]">
      {/* Top Header */}
      <Header
        onOpenMenu={() => setIsMenuOpen(true)}
        onOpenCart={() => setIsCartOpen(true)}
        cartCount={totalCartCount}
      />

      {/* Main Content Container with max width 1280px matching design container-max */}
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-16 flex flex-col">
        {/* Hero Section with Headline, 3-column layout & live donor ticker */}
        <HeroSection
          donors={donors}
          currentCount={currentCount}
          totalCount={totalCount}
          isLoadingCampaign={isLoadingCampaign}
          isLoadingDonors={isLoadingDonors}
          onOpenJoinModal={() => {
            setSelectedPieceForJoin(null);
            setIsJoinModalOpen(true);
          }}
          onOpenImageLightbox={openLightbox}
        />

        {/* The Context / Purpose Section with Reality Photos & Collection Gallery */}
        <ContextSection
          currentCount={currentCount}
          totalCount={totalCount}
          isLoadingCampaign={isLoadingCampaign}
          onOpenImageLightbox={openLightbox}
          onAddToCart={handleAddToCart}
          onSelectPieceForJoin={(piece) => {
            setSelectedPieceForJoin(piece);
            setIsJoinModalOpen(true);
          }}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenPolicy={() => setIsPolicyOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenAdmin={navigateToAdmin}
      />

      {/* Modals and Drawers */}
      <JoinModal
        isOpen={isJoinModalOpen}
        onClose={() => setIsJoinModalOpen(false)}
        onJoinSuccess={handleJoinSuccess}
        initialPiece={selectedPieceForJoin}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onCheckoutSuccess={(donorName, msg) => {
          handleJoinSuccess(donorName, msg, 'Orden en Bolsa Solidaria');
        }}
      />

      <MenuDrawer
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onOpenJoin={() => {
          setSelectedPieceForJoin(null);
          setIsJoinModalOpen(true);
        }}
      />

      <LightboxModal
        isOpen={lightbox.isOpen}
        imageUrl={lightbox.url}
        title={lightbox.title}
        onClose={closeLightbox}
      />

      <SolidarityPolicyModal
        isOpen={isPolicyOpen}
        onClose={() => setIsPolicyOpen(false)}
      />

      <ImpactReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        currentCount={currentCount ?? 0}
        totalCount={totalCount}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
