import { afterAll, beforeAll, afterEach, describe, test, expect } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { AppProvider } from "../../../context/AppProvider";
import { ProductsPage } from "../../../pages/ProductsPage";
import { MockWebServer } from "../../../tests/mockWebServer";
import { getEmptyProducts, getProducts } from "./productsPage.fixture";
import {
    openDialogToEditPrice,
    verifyDialog,
    verifyHeader,
    verifyRows,
    waitToTableIsLoaded,
} from "./productPage.helpers";

const mockWebServer = new MockWebServer();

describe("ProductsPage", () => {
    beforeAll(() => mockWebServer.start());
    afterEach(() => mockWebServer.resetHandlers());
    afterAll(() => mockWebServer.close());

    test("Loads and displays title", async () => {
        getProducts(mockWebServer);
        renderComponent(<ProductsPage />);

        await screen.findAllByRole("heading", { name: "Product price updater" });
    });

    describe("Table", () => {
        test("Should show an empty table if there are not products", async () => {
            getEmptyProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            const rows = await screen.findAllByRole("row");

            expect(rows.length).toBe(1);
            verifyHeader(rows[0]);
        });

        test("Should show header and expected rows", async () => {
            const products = getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            const allRows = await screen.findAllByRole("row");
            const [header, ...rows] = allRows;

            verifyHeader(header);
            verifyRows(rows, products);
        });
    });

    describe("Edit price", () => {
        test("Should show a dialog and info product", async () => {
            const products = getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);
            verifyDialog(dialog, products[0]);
        });
    });
});

const renderComponent = (component: React.ReactNode): RenderResult => {
    return render(<AppProvider>{component}</AppProvider>);
};
