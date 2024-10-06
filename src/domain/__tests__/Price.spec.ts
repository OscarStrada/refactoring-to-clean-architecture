import { describe, expect, test } from "vitest";
import { Price } from "../price";

describe("Price", () => {
    test("Should create price if all validations are ok", () => {
        const price = Price.create("2.4");

        expect(price).toBeTruthy();
    });

    test("Should throw an error for negative prices", () => {
        expect(() => Price.create("-10.5")).toThrowError("Invalid price format");
    });

    test("Should throw an error for non number prices", () => {
        expect(() => Price.create("nonnumber")).toThrowError("Only numbers are allowed");
    });

    test("Should throw an error for prices greater than 999.99", () => {
        expect(() => Price.create("1000")).toThrowError("The max possible price is 999.99");
    });
});
