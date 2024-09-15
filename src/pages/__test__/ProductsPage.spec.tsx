import { afterAll, beforeAll, describe, test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";
import { MockWebServer } from "../../tests/mockWebServer";
import { afterEach } from "node:test";
import productsResponse from "./data/productsResponse.json";

const mockWebServer = new MockWebServer();

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", async () => {
        getProducts();
        renderComponent(<ProductsPage />);

        await screen.findAllByRole("heading", { name: "Product price updater" });
    });
});

const renderComponent = (component: React.ReactNode): RenderResult => {
    return render(<AppProvider>{component}</AppProvider>);
};

const getProducts = () => {
    mockWebServer.addRequestHandlers([
        {
            method: "get",
            endpoint: "https://fakestoreapi.com/products",
            httpStatusCode: 200,
            response: productsResponse,
        },
    ]);
};
