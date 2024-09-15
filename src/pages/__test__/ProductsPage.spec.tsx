import { test } from "vitest";
import { render, RenderResult, screen } from "@testing-library/react";
import { AppProvider } from "../../context/AppProvider";
import { ProductsPage } from "../ProductsPage";

test("Loads and displays title", async () => {
    renderComponent(<ProductsPage />);

    await screen.findAllByRole("heading", { name: "Product price updater" });
});

const renderComponent = (component: React.ReactNode): RenderResult => {
    return render(<AppProvider>{component}</AppProvider>);
};
