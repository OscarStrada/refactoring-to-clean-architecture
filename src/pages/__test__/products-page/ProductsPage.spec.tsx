import { afterAll, beforeAll, afterEach, describe, test, expect } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { AppProvider } from "../../../context/AppProvider";
import { ProductsPage } from "../../../pages/ProductsPage";
import { MockWebServer } from "../../../tests/mockWebServer";
import { getEmptyProducts, getProducts } from "./productsPage.fixture";
import {
    changeToNonAdminUser,
    openDialogToEditPrice,
    savePrice,
    tryOpenDialogToEditPrice,
    verifyDialog,
    verifyError,
    verifyHeader,
    verifyPrice,
    verifyPriceAndStatusInRow,
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

        test("Should show an error for negative prices", async () => {
            getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);

            await verifyPrice(dialog, "-1");
            await verifyError(dialog, "Invalid price format");
        });

        test("Should show an error for non numbers", async () => {
            getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);

            await verifyPrice(dialog, "nonnumeric");
            await verifyError(dialog, "Only numbers are allowed");
        });

        test("Should show an error for prices greater than 999.99", async () => {
            getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);

            await verifyPrice(dialog, "1000");
            await verifyError(dialog, "The max possible price is 999.99");
        });

        test("Should update price and set to active for a price greater than 0", async () => {
            getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);

            const newPrice = "129.5";

            await verifyPrice(dialog, newPrice);
            await savePrice(dialog);
            await verifyPriceAndStatusInRow(0, newPrice, "active");
        });

        test("Should set status to inactive when price is equal to 0", async () => {
            getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();
            const dialog = await openDialogToEditPrice(0);

            const newPrice = "0";

            await verifyPrice(dialog, newPrice);
            await savePrice(dialog);
            await verifyPriceAndStatusInRow(0, newPrice, "inactive");
        });

        test("Should show an error if user is not admin", async () => {
            getProducts(mockWebServer);
            renderComponent(<ProductsPage />);

            await waitToTableIsLoaded();

            await changeToNonAdminUser();
            await tryOpenDialogToEditPrice(0);
            await screen.findByText(/only admin users can edit the price of a product/i);
        });
    });
});

const renderComponent = (component: React.ReactNode): RenderResult => {
    return render(<AppProvider>{component}</AppProvider>);
};
