import { Product } from "../../domain/product";
import { useReload } from "../../presentation/hooks/useReload";
import { useCallback, useEffect, useState } from "react";
import { GetProductsUseCase } from "../../domain/getProductsUseCase";
import { useAppContext } from "../context/useAppContext";
import { GetProductByIdUseCase, ResourceNotFound } from "../../domain/getProductByIdUseCase";

export const useProducts = (
    getProductsUseCase: GetProductsUseCase,
    getProductByIdUseCase: GetProductByIdUseCase
) => {
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

                try {
                    const product = await getProductByIdUseCase.execute(id);
                    setEditingProduct(product);
                } catch (error) {
                    if (error instanceof ResourceNotFound) {
                        setError(error.message);
                    } else {
                        setError("Unexpected error");
                    }
                }
            }
        },
        [currentUser.isAdmin, getProductByIdUseCase]
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
