import { Product } from "./product";

export interface ProductRepository {
    getAll(): Promise<Product[]>;
}
