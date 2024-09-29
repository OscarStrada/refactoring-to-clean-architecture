import { Product } from "../../domain/product";
import { useReload } from "../../presentation/hooks/useReload";
import { useCallback, useEffect, useState } from "react";
import { GetProductsUseCase } from "../../domain/getProductsUseCase";
import { StoreApi } from "../../data/api/StoreApi";
import { useAppContext } from "../context/useAppContext";
import { buildProduct } from "../../data/productApiRepository";

export const useProducts = (getProductsUseCase: GetProductsUseCase, storeApi: StoreApi) => {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<Product[]>([]);
    const [error, setError] = useState<string>();
    const [editingProduct, setEditingProduct] = useState<Product | undefined>(undefined);

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);

            setProducts(products);
        });
    }, [reloadKey, getProductsUseCase]);

    const updatingQuantity = useCallback(
        async (id: number) => {
            if (id) {
                if (!currentUser.isAdmin) {
                    setError("Only admin users can edit the price of a product");
                    return;
                }

                storeApi
                    .get(id)
                    .then(buildProduct)
                    .then(product => {
                        setEditingProduct(product);
                    })
                    .catch(() => {
                        setError(`Product with id ${id} not found`);
                    });
            }
        },
        [currentUser.isAdmin, storeApi]
    );

    const cancelEditPrice = useCallback(() => {
        setEditingProduct(undefined);
    }, [setEditingProduct]);

    return {
        products,
        reload,
        updatingQuantity,
        editingProduct,
        setEditingProduct,
        error,
        cancelEditPrice,
    };
};
