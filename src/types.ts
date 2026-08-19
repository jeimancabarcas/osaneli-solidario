export interface Donor {
  id: string;
  name: string;
  timeAgo: string;
  timestamp: number;
  message?: string;
  itemSupported?: string;
  city?: string;
  status?: string;
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

export type OrderStatus = 'pending' | 'confirmed' | 'rejected';

export interface OrderItem {
  pieceId: string;
  name: string;
  size: string;
  quantity: number;
  priceCOP: number;
}

export interface Order {
  id: string;
  name: string;
  docType: string;
  docNumber: string;
  phoneNumber: string;
  city: string;
  address: string;
  message?: string;
  itemSupported: string;
  items?: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  timestamp: number;
  timeAgo?: string;
  confirmedAt?: number;
}
