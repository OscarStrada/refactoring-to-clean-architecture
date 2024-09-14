import { test } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../../App";

test("Loads and displays title", async () => {
    render(<App />);

    await screen.findAllByRole("heading", { name: "Product price updater" });
});
