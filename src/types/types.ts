

  
  export type TReview = {
    id?: number
    name: string
    email?: string
    rating: number
    comment: string
    date?: string
    helpful?: number
    unhelpful?: number
    verified?: boolean
    images?: string[]
  }


  type TImage = {
    image: string;
    id: number;
  };

  export type TVariant = {
    id: number;
    title: string;
    color: string;
    priceAfterDiscount: number;
    mainPrice: number;
    discountPercent: number;
    inStock: boolean;
    quantity: number;
    productCode: string;
    shortDescription: string;
    imgList: TImage[];
  };
  
  export type TProduct = {
    id: number;
    shortDescription?: string;
    longDescription?: string;
    brand?: string;
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
    averageRating?: number;
    totalReviews?: number;
    variants: TVariant[];
  };
  

  export interface Order {
    id: string
    orderNumber: string
    orderDate: string
    processingDate?: string
    shippingDate?: string
    deliveryDate?: string
    cancellationDate?: string
    estimatedDelivery?: string
    status: "processing" | "shipped" | "delivered" | "cancelled"
    items: OrderItem[]
    subtotal: number
    shipping: number
    tax: number
    discount: number
    total: number
    paymentMethod: string
    paymentDetails?: {
      cardType: string
      lastFourDigits: string
      expiryDate: string
    }
    shippingAddress: {
      name: string
      street: string
      city: string
      state: string
      zipCode: string
      country: string
      phone?: string
    }
    trackingNumber?: string
    trackingUrl?: string
  }
  
  export interface OrderItem {
    id: string
    name: string
    sku: string
    price: number
    quantity: number
    variant?: string
    image?: string
    originalPrice?: number
  }
  
  