import { Options, parseMessage } from "../parse-message";

describe("parseMessage", () => {
    const defaultOptions = {
        message: "John spent $10.99 for lunch",
        blacklistedKeywords: ["for", "spent"],
        categories: [
            {
                name: "Food",
                keywords: ["lunch", "dinner", "breakfast"],
            },
        ],
        fallbackCategory: "Other",
        initiator: {
            discordId: "",
            name: "John",
            aliases: [],
            position: "person1",
        },
        other: {
            discordId: "",
            name: "Jane",
            aliases: [],
            position: "person2",
        },
    } as Options;

    it("should parse the message and return the correct output", () => {
        expect(parseMessage(defaultOptions)).toEqual({
            amount: "10.99",
            category: "Food",
            description: "Lunch",
            purchaser: "person1",
        });
    });

    it("should parse the message and assign to the correct purchaser", () => {
        expect(
            parseMessage({
                ...defaultOptions,
                message: "Jane spent $10.99 for lunch",
            })
        ).toEqual({
            amount: "10.99",
            category: "Food",
            description: "Lunch",
            purchaser: "person2",
        });
    });

    it("should fallback to the initiator's name if no match is found", () => {
        const messageWithNoCategoryMatchOptions = {
            ...defaultOptions,
            message: "$10.99 for lunch",
        };

        expect(parseMessage(messageWithNoCategoryMatchOptions)).toEqual({
            amount: "10.99",
            category: "Food",
            description: "Lunch",
            purchaser: "person1",
        });
    });

    it("should fallback to the default category if no match is found", () => {
        expect(
            parseMessage({
                ...defaultOptions,
                message: "John spent $10.99 for random stuff",
            })
        ).toEqual({
            amount: "10.99",
            category: "Other",
            description: "Random stuff",
            purchaser: "person1",
        });
    });

    it("should throw if the message is empty", () => {
        expect(() =>
            parseMessage({
                ...defaultOptions,
                message: "",
            })
        ).toThrow();
    });

    it("should throw if the purchase amount is missing", () => {
        expect(() =>
            parseMessage({
                ...defaultOptions,
                message: "Lunch at place",
            })
        ).toThrow();
    });

    it("should throw if the description is missing", () => {
        expect(() =>
            parseMessage({
                ...defaultOptions,
                message: "$12.99",
            })
        ).toThrow();
    });
});
