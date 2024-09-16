import { MockWebServer } from "@/tests/mockWebServer";
import productsResponse from "./data/productsResponse.json";
import { RemoteProduct } from "@/data/api/StoreApi";

export const getProducts = (mockWebServer: MockWebServer): RemoteProduct[] => {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: productsResponse,
        },
    ]);

    return productsResponse;
};

export const getEmptyProducts = (mockWebServer: MockWebServer) => {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: [],
        },
    ]);
};
