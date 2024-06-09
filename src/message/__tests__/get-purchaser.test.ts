import getPurchaser from "../get-purchaser";
import { Person } from "src/types";

describe("getPurchaser", () => {
    const initiator = {
        discordId: "",
        name: "John",
        aliases: ["Johnny", "John Doe"],
    } as Person;

    const other = {
        discordId: "",
        name: "Jane",
        aliases: ["Janey", "Jane Smith"],
    } as Person;

    it("should return the other person if their name is found in the message", () => {
        const message = "Jane spent $12.99 for Netflix";
        const expected = {
            name: "Jane",
            match: "Jane",
        };
        const result = getPurchaser(message, initiator, other);
        expect(result).toEqual(expected);
    });

    it("should return the other person if their nickname is found in the message", () => {
        const message = "Janey spent $12.99 for Netflix";
        const expected = {
            name: "Jane",
            match: "Janey",
        };
        const result = getPurchaser(message, initiator, other);
        expect(result).toEqual(expected);
    });

    it("should return the initiator if their name is found in the message", () => {
        const message = "John spent $12.99 for Netflix";
        const expected = {
            name: "John",
            match: "John",
        };
        const result = getPurchaser(message, initiator, other);
        expect(result).toEqual(expected);
    });

    it("should return the initiator if their nickname is found in the message", () => {
        const message = "Johnny spent $12.99 for Netflix";
        const expected = {
            name: "John",
            match: "Johnny",
        };
        const result = getPurchaser(message, initiator, other);
        expect(result).toEqual(expected);
    });

    it("should return the initiator if no match is found in the message", () => {
        const message = "$12.99 Netflix";
        const expected = {
            name: "John",
            match: "John",
        };
        const result = getPurchaser(message, initiator, other);
        expect(result).toEqual(expected);
    });
});
