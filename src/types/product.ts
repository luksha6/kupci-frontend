export type ProductCategory =
  | "tech"
  | "home"
  | "fashion"
  | "outdoor"
  | "books";

export interface PricingTier {
  name: string;
  sku: string;
  price: number;
  currency: string;
}

export interface ProductMetadata {
  brand: string;
  manufacturerCountry: string;
  weightKg: number;
  dimensions: { w: number; h: number; d: number };
}

export interface Product {
  id: string;
  title: string;
  description: string;
  category: ProductCategory;
  rating: number;
  reviewCount: number;
  tags: string[];
  metadata: ProductMetadata;
  pricingTiers: PricingTier[];
  availability: {
    inStock: boolean;
    stockUnits: number;
    restockEtaDays: number | null;
  };
  featured: boolean;
  createdAt: number;
}

export type SortOption = "newest" | "price_asc" | "price_desc" | "rating";
