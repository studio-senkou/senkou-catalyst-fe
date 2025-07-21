// global.d.ts
export {};

declare global {
  interface Product {
    id: number;
    name: string;
    price: string;
    rating: string;
    isNew?: boolean;
    image: string;
    category?: string;
    brand?: string;
    bgColor?: string;
    originalPrice?: string;
    discount?: string;
  }

  interface Testimonial {
    name: string;
    role: string;
    text: string;
    rating: number;
  }
}
