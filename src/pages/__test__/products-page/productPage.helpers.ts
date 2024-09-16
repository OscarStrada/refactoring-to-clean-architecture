import { RemoteProduct } from "@/api/StoreApi";
import { screen, waitFor, within } from "@testing-library/react";
import { expect } from "vitest";
import userEvent from "@testing-library/user-event";

export const verifyHeader = (header: HTMLElement) => {
    const headerScope = within(header);
    const cells = headerScope.getAllByRole("columnheader");

    expect(cells.length).toBe(6);
    within(cells[0]).getByText("ID");
    within(cells[1]).getByText("Title");
    within(cells[2]).getByText("Image");
    within(cells[3]).getByText("Price");
    within(cells[4]).getByText("Status");
};

export const verifyRows = (rows: HTMLElement[], products: RemoteProduct[]) => {
    expect(rows.length).toBe(products.length);

    rows.forEach((row, index) => {
        const rowScope = within(row);
        const cells = rowScope.getAllByRole("cell");

        expect(cells.length).toBe(6);

        const product = products[index];

        within(cells[0]).getByText(product.id);
        within(cells[1]).getByText(product.title);

        const image: HTMLImageElement = within(cells[2]).getByRole("img");
        expect(image.src).toBe(product.image);

        within(cells[3]).getByText(`$${product.price.toFixed(2)}`);
        within(cells[4]).getByText(product.price === 0 ? "inactive" : "active");
    });
};

export const tryOpenDialogToEditPrice = async (index: number) => {
    const allRows = await screen.findAllByRole("row");

    const [, ...rows] = allRows;
    const row = rows[index];
    const rowScope = within(row);

    await userEvent.click(rowScope.getByRole("menuitem"));
    const updatePriceMenu = await screen.findByRole("menuitem", { name: /update price/i });

    await userEvent.click(updatePriceMenu);
};

export const openDialogToEditPrice = async (index: number): Promise<HTMLElement> => {
    await tryOpenDialogToEditPrice(index);

    return await screen.findByRole("dialog");
};

export const verifyDialog = (dialog: HTMLElement, product: RemoteProduct) => {
    const dialogScope = within(dialog);

    const image: HTMLImageElement = dialogScope.getByRole("img");
    expect(image.src).toBe(product.image);

    dialogScope.getByText(product.title);

    expect(dialogScope.getByDisplayValue(product.price));
};

export const verifyPrice = async (dialog: HTMLElement, price: string) => {
    const dialogScope = within(dialog);
    const priceTextBox = dialogScope.getByRole("textbox", { name: "Price" });

    await userEvent.clear(priceTextBox);

    await userEvent.type(priceTextBox, price);
};

export const verifyError = async (dialog: HTMLElement, error: string) => {
    const dialogScope = within(dialog);
    await dialogScope.findByText(error);
};

export const savePrice = async (dialog: HTMLElement) => {
    const dialogScope = within(dialog);

    await userEvent.click(dialogScope.getByRole("button", { name: /save/i }));
};

export const verifyPriceAndStatusInRow = async (
    index: number,
    newPrice: string,
    status: string
) => {
    const allRows = await screen.findAllByRole("row");
    const [, ...rows] = allRows;
    const row = rows[index];

    const rowScope = within(row);
    const cells = rowScope.getAllByRole("cell");

    within(cells[3]).getByText(`$${(+newPrice).toFixed(2)}`);
    within(cells[4]).getByText(status);
};

export const changeToNonAdminUser = async () => {
    await userEvent.click(screen.getByRole("button", { name: /user: admin user/i }));
    await userEvent.click(screen.getByRole("menuitem", { name: /non admin user/i }));
};

export const waitToTableIsLoaded = async () => {
    await waitFor(async () =>
        expect((await screen.findAllByRole("row")).length).toBeGreaterThan(1)
    );
};
