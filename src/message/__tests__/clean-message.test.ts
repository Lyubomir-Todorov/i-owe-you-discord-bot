import cleanMessage from "../clean-message";

describe("cleanMessage", () => {
    it("should remove blacklisted keywords and special characters, and convert the message to lowercase", () => {
        const message = "John spent $10.99 for product in miscellaneous";
        const blacklistedKeywords = ["for", "in"];

        const cleanedMessage = cleanMessage(message, blacklistedKeywords);

        expect(cleanedMessage).toEqual(
            "john spent 10.99 product miscellaneous"
        );
    });

    it("should not remove blacklisted words that appear in whole words", () => {
        const message = "testing";
        const blacklistedKeywords: string[] = ["test", "in"];

        const cleanedMessage = cleanMessage(message, blacklistedKeywords);

        expect(cleanedMessage).toEqual("testing");
    });

    it("should handle empty message", () => {
        const message = "";
        const blacklistedKeywords = ["test", "message"];

        const cleanedMessage = cleanMessage(message, blacklistedKeywords);

        expect(cleanedMessage).toEqual("");
    });

    it("should handle empty blacklisted keywords", () => {
        const message = "John spent $10.99 for product in miscellaneous";
        const blacklistedKeywords: string[] = [];

        const cleanedMessage = cleanMessage(message, blacklistedKeywords);

        expect(cleanedMessage).toEqual(
            "john spent 10.99 for product in miscellaneous"
        );
    });
});
