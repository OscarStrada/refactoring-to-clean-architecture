import { Product } from "../../domain/product";
import { useReload } from "../../presentation/hooks/useReload";
import { useCallback, useEffect, useState } from "react";
import { GetProductsUseCase } from "../../domain/getProductsUseCase";
import { useAppContext } from "../context/useAppContext";
import { GetProductByIdUseCase } from "../../domain/getProductByIdUseCase";
import { Price, ValidationError } from "../../domain/price";
import { ResourceNotFound } from "../../domain/productRepository";

export type ProductStatus = "active" | "inactive";

export type ProductViewModel = Product & { status: ProductStatus };

export const useProducts = (
    getProductsUseCase: GetProductsUseCase,
    getProductByIdUseCase: GetProductByIdUseCase
) => {
    const { currentUser } = useAppContext();
    const [reloadKey, reload] = useReload();

    const [products, setProducts] = useState<ProductViewModel[]>([]);
    const [editingProduct, setEditingProduct] = useState<ProductViewModel | undefined>(undefined);

    const [error, setError] = useState<string>();
    const [priceError, setPriceError] = useState<string | undefined>(undefined);

    useEffect(() => {
        getProductsUseCase.execute().then(products => {
            console.debug("Reloading", reloadKey);

            setProducts(products.map(buildProductViewModel));
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
                    setEditingProduct(buildProductViewModel(product));
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

    function onChangePrice(price: string): void {
        if (!editingProduct) return;

        try {
            setEditingProduct({ ...editingProduct, price });
            Price.create(price);
            setPriceError(undefined);
        } catch (error) {
            if (error instanceof ValidationError) {
                setPriceError(error.message);
            } else {
                setPriceError("Unexpected error occurred");
            }
        }
    }

    return {
        products,
        reload,
        updatingQuantity,
        editingProduct,
        setEditingProduct,
        cancelEditPrice,
        onChangePrice,
        error,
        priceError,
    };
};

export function buildProductViewModel(product: Product): ProductViewModel {
    return {
        ...product,
        status: +product.price === 0 ? "inactive" : "active",
    };
}
