
export type TReview = {
  id?: string;
  userId?: string;
  user?: {
    id: string;
    fullName?: string;
    profileImage?: string;
  };
  productId?: string;
  name?: string;
  email?: string;
  profileImage?: string;
  rating: number;
  comment: string;
  date?: string;
  helpful?: number;
  unhelpful?: number;
  verified?: boolean;
  images?: string[];
  createdAt?: string;
};

export type TImage = {
  image: string;
  id: string;
};

export type TVariant = {
  id: string;
  title: string;
  color: string;
  priceAfterDiscount: number;
  mainPrice: number;
  discountPercent: number;
  inStock: boolean;
  quantity: number;
  productCode: string;
  shortDescription?: string;
  imgList: TImage[];
  productId?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type TProduct = {
  id: string;
  title: string;
  brand?: string;
  categories?: string[];
  subCategories?: string[];
  types?: string[];

  // Legacy/mock fields (used by storefront components and productMockData)
  img?: string;
  color?: string;
  inStock?: boolean;
  discountPercent?: string | number;
  priceAfterDiscount?: number;
  mainPrice?: number;

  shortDescription?: string;
  longDescription?: string;
  material?: string;
  dimensions?: string;
  weight?: string;
  shippingInfo?: string;
  frameType?: string;
  lensType?: string;
  warranty?: string;
  countryOfOrigin?: string;
  targetAudience?: string;
  careInstructions?: string;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isBestSeller?: boolean;
  isTrending?: boolean;
  salePercentage?: number;
  averageRating?: number;
  totalReviews?: number;
  status?: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  variants: TVariant[];
  reviews?: TReview[];
  createdAt?: string;
  updatedAt?: string;
};

export interface TOrder {
  id: string;
  orderNumber: string;
  orderDate?: string;
  createdAt?: string;
  processingDate?: string;
  shippingDate?: string;
  deliveryDate?: string;
  cancellationDate?: string;
  estimatedDelivery?: string;
  status:
    | "PROCESSING"
    | "SHIPPED"
    | "DELIVERED"
    | "CANCELLED"
    // Legacy lowercase (used by mock data / data.ts)
    | "processing"
    | "shipped"
    | "delivered"
    | "cancelled";
  paymentMethod:
    | "CREDIT_CARD"
    | "PAYPAL"
    | "CASH_ON_DELIVERY"
    | "STRIPE"
    | "SSLCO"
    // Legacy display strings (used by mock data / data.ts)
    | "Credit Card"
    | "PayPal"
    | "Cash on Delivery"
    | "Bank Transfer";
  items: TOrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  shippingMethod?: string;
  trackingNumber?: string;
  trackingUrl?: string;
  shippingAddress: {
    name?: string;
    street?: string;
    address?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    phone?: string;
  };
  paymentDetails?: {
    cardType?: string;
    lastFourDigits?: string;
    expiryDate?: string;
  };
  user?: {
    id: string;
    fullName?: string;
    email?: string;
    profileImage?: string;
  };
}

export interface TOrderItem {
  id: string;
  orderId?: string;
  productId?: string;
  name: string;
  sku: string;
  price: number;
  quantity: number;
  variant?: string;
  image?: string;
  originalPrice?: number;
}