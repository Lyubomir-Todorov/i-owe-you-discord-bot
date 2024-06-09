import cleanMessage from "../clean-message";

describe("cleanMessage", () => {
    it("should remove blacklisted keywords and special characters, and convert the message to lowercase", () => {
        const message = "Hello, this is a test message!";
        const blacklistedKeywords = ["test", "message"];

        const cleanedMessage = cleanMessage(message, blacklistedKeywords);

        expect(cleanedMessage).toEqual("hello this is a");
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
        const message = "Hello, this is a test message!";
        const blacklistedKeywords: string[] = [];

        const cleanedMessage = cleanMessage(message, blacklistedKeywords);

        expect(cleanedMessage).toEqual("hello this is a test message");
    });
});
