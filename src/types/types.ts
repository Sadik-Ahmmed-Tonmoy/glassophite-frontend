

  
  export type TReview = {
    id?: string
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
    shortDescription: string;
    imgList: TImage[];
  };
  
  export type TProduct = {
    id: string;

    img : string
     title: string 
     color:string 
    inStock: boolean
  reviews: TReview[]
discountPercent: string
  priceAfterDiscount?: number
  mainPrice?: number
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
    isFeatured?: boolean;
    category?:string;
    variants: TVariant[];
  };
  

  export interface TOrder {
    id: string
    orderNumber: string
    orderDate: string
    processingDate?: string
    shippingDate?: string
    deliveryDate?: string
    cancellationDate?: string
    estimatedDelivery?: string
    status: "processing" | "shipped" | "delivered" | "cancelled"
    items: TOrderItem[]
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
  
  export interface TOrderItem {
    id: string
    name: string
    sku: string
    price: number
    quantity: number
    variant?: string
    image?: string
    originalPrice?: number
  }
  
  