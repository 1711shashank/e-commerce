export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subCategory?: string;
  price: number;
  discountPrice?: number;
  images: string[];
  sizes: string[];
  colors: string[];
  fabric?: string;
  description: string;
  isNew: boolean;
  isOnSale: boolean;
  inStock: boolean;
  rating?: number;
  createdAt: string;
  tags?: string[];
  stitchingOptions?: Array<"unstitched" | "stitched">;
  pieces?: 1 | 2 | 3 | "abaya-set";
  fabricBreakdown?: {
    shirt?: string;
    dupatta?: string;
    trouser?: string;
    abaya?: string;
    slip?: string;
  };
  embellishments?: string[];
  includesSlip?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  parentId?: string | null;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
}

export type SortOption =
  | "newest"
  | "price-asc"
  | "price-desc"
  | "best-selling"
  | "a-z";

export interface ProductFilters {
  category?: string;
  subCategory?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  fabrics?: string[];
  pieces?: (1 | 2 | 3 | "abaya-set")[];
  stitchingType?: "unstitched" | "stitched" | null;
  inStock?: boolean | null;
  search?: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  stitchingType?: "unstitched" | "stitched";
}

export type ViewMode = "grid" | "list";
export type CardLayoutStyle = "atelier" | "runway" | "heritage";

