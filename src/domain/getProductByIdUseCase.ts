import { Product } from "./product";
import { ProductRepository } from "./productRepository";

export class GetProductByIdUseCase {
    constructor(private productRepository: ProductRepository) {}

    async execute(id: number): Promise<Product> {
        return this.productRepository.getById(id);
    }
}
