import getPurchaseAmount from "../get-purchase-amount";

describe("getPurchaseAmount", () => {
    it("should retrieve the purchase amount from the message", () => {
        const message = "$10.99 Product";
        const purchaseAmount = getPurchaseAmount(message);

        expect(purchaseAmount).toEqual("10.99");
    });

    it("should return undefined if the purchase amount is not found", () => {
        const message = "No purchase amount mentioned";
        const purchaseAmount = getPurchaseAmount(message);

        expect(purchaseAmount).toBeUndefined();
    });

    it("should handle multiple purchase amounts and return the first one", () => {
        const message = "12.99 product 20.99";
        const purchaseAmount = getPurchaseAmount(message);

        expect(purchaseAmount).toEqual("12.99");
    });

    it("should handle purchase amounts with no decimal places", () => {
        const message = "100 Product";
        const purchaseAmount = getPurchaseAmount(message);

        expect(purchaseAmount).toEqual("100");
    });

    it("should handle purchase amounts with only decimal places", () => {
        const message = "The cost is $0.99";
        const purchaseAmount = getPurchaseAmount(message);

        expect(purchaseAmount).toEqual("0.99");
    });
});
