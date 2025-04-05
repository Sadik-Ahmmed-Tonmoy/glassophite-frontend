
type TReview = {
    rating: number;
    comment: string;
  };
  
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
    reviews?: TReview[];
    variants: TVariant[];
  };
  

  