import { Product } from "./product";
import { ProductRepository } from "./productRepository";

export class GetProductsUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(): Promise<Product[]> {
        return this.productRepository.getAll();
    }
}
