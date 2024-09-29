import { StoreApi } from "./data/api/StoreApi";
import { ProductApiRepository } from "./data/productApiRepository";
import { GetProductByIdUseCase } from "./domain/getProductByIdUseCase";
import { GetProductsUseCase } from "./domain/getProductsUseCase";

export class CompositionRoot {
    private constructor() {}

    private static instance: CompositionRoot;

    private storeApi = new StoreApi();
    private productRepository = new ProductApiRepository(this.storeApi);

    public static getInstance(): CompositionRoot {
        if (!CompositionRoot.instance) {
            CompositionRoot.instance = new CompositionRoot();
        }

        return CompositionRoot.instance;
    }

    provideGetProductsUseCase(): GetProductsUseCase {
        return new GetProductsUseCase(this.productRepository);
    }

    provideGetProductByIdUseCase(): GetProductByIdUseCase {
        return new GetProductByIdUseCase(this.productRepository);
    }

    provideStoreApi(): StoreApi {
        return this.storeApi;
    }
}
