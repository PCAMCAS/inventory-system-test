export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number | string;
  stock: number;
  categoryId: string;
  createdAt: string;
  updatedAt?: string;
  category?: {
    id: string;
    name: string;
  };
};

export type SortField = "name" | "price" | "stock" | "createdAt";
export type SortOrder = "asc" | "desc";
