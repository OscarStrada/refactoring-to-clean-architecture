import { RemoteProduct, StoreApi } from "../api/StoreApi";
import { useReload } from "../hooks/useReload";
import { useEffect, useState } from "react";

export const useProducts = (storeApi: StoreApi) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [reloadKey, reload] = useReload();

    useEffect(() => {
        storeApi.getAll().then(response => {
            console.debug("Reloading", reloadKey);

            const remoteProducts = response as RemoteProduct[];

            const products = remoteProducts.map(buildProduct);

            setProducts(products);
        });
    }, [reloadKey, storeApi]);

    return {
        products,
        reload,
    };
};

export interface Product {
    id: number;
    title: string;
    image: string;
    price: string;
}

export function buildProduct(remoteProduct: RemoteProduct): Product {
    return {
        id: remoteProduct.id,
        title: remoteProduct.title,
        image: remoteProduct.image,
        price: remoteProduct.price.toLocaleString("en-US", {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2,
        }),
    };
}
