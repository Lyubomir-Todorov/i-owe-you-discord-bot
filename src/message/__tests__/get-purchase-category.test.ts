import getPurchaseCategory from "../get-purchase-category";
import { PurchaseCategory } from "src/types";

describe("getPurchaseCategory", () => {
    const categories: PurchaseCategory[] = [
        { name: "Groceries", keywords: ["Walmart"] },
        { name: "Utilities", keywords: ["Electricity", "Internet"] },
    ];

    it("should return the matching purchase category when directly mentioned", () => {
        const message = "$12.99 for groceries";
        const expectedCategory = "Groceries";
        const result = getPurchaseCategory(message, categories);
        expect(result).toBe(expectedCategory);
    });

    it("should return the matching purchase category when a keyword is mentioned", () => {
        const message = "$12.99 at Walmart";
        const expectedCategory = "Groceries";
        const result = getPurchaseCategory(message, categories);
        expect(result).toBe(expectedCategory);
    });

    it("should return undefined if no match is found", () => {
        const message = "$12.99 one-off purchase";
        const result = getPurchaseCategory(message, categories);
        expect(result).toBeUndefined();
    });
});
