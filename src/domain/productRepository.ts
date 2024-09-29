import { Product } from "./product";

export interface ProductRepository {
    getAll(): Promise<Product[]>;

    getById(id: number): Promise<Product>;
}

export class ResourceNotFound extends Error {}
