export interface Donor {
  id: string;
  name: string;
  timeAgo: string;
  timestamp: number;
  message?: string;
  itemSupported?: string;
}

export interface CollectionPiece {
  id: string;
  name: string;
  tag: string;
  type: 't-shirt' | 'crop' | 'shorts' | 'hoodie' | 'special';
  color: string;
  colorName: string;
  priceUSD: number;
  priceCOP: number;
  editionNumber: number;
  totalEdition: number;
  description: string;
  features: string[];
}

export interface CartItem {
  piece: CollectionPiece;
  size: string;
  quantity: number;
}
