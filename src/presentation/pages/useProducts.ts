import { Product } from "../../domain/product";
import { useReload } from "../../presentation/hooks/useReload";
import { useEffect, useState } from "react";
import { GetProductsUseCase } from "../../domain/getProductsUseCase";

export const useProducts = (getProductsUseCase: GetProductsUseCase) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [reloadKey, reload] = useReload();

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);

            setProducts(products);
        });
    }, [reloadKey, getProductsUseCase]);

    return {
        products,
        reload,
    };
};
