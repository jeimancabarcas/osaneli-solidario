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
import { COLLECTION_PIECES, INITIAL_DONORS } from './data/mockData';
import { Donor, CartItem, CollectionPiece } from './types';
import {
  subscribeToDonors,
  subscribeToCampaign,
} from './services/firebaseService';

export default function App() {
  const [donors, setDonors] = useState<Donor[]>(INITIAL_DONORS);
  const [currentCount, setCurrentCount] = useState<number>(142);
  const [totalCount, setTotalCount] = useState<number>(200);

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

  // Real-time Firestore Subscriptions
  useEffect(() => {
    const unsubDonors = subscribeToDonors((realtimeDonors) => {
      setDonors(realtimeDonors);
    });

    const unsubCampaign = subscribeToCampaign((stats) => {
      setCurrentCount(stats.currentCount);
      setTotalCount(stats.totalCount);
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

  // Handle order submission - purely WhatsApp redirect without automatic Firestore recording
  const handleJoinSuccess = (_donorName: string, _message: string, _itemSupported?: string) => {
    // The order is dispatched to WhatsApp for manual verification and subsequent registration by the owner
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
          onOpenJoinModal={() => {
            setSelectedPieceForJoin(null);
            setIsJoinModalOpen(true);
          }}
          onOpenImageLightbox={openLightbox}
        />

        {/* The Context / Purpose Section with Reality Photos & Collection Gallery */}
        <ContextSection
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
        currentCount={currentCount}
      />

      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
    </div>
  );
}
