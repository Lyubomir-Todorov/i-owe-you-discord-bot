import { Person } from "src/types";

type Return = {
    name: string;
    match: string;
};

/**
 * Retrieves the purchaser from the given message based on the provided initiator and other persons.
 * @param message - The message to search for the purchaser.
 * @param initiator - The initiator person object.
 * @param other - The other person object.
 * @returns The purchaser information. Defaults to the initiator if no match is found.
 */
export default function getPurchaser(
    message: string,
    initiator: Person,
    other: Person
): Return {
    const otherPersonRegexp = new RegExp(
        other.name + "|" + other.aliases.join("|"),
        "i"
    );

    const otherPersonMatch = otherPersonRegexp.exec(message);
    if (otherPersonMatch) {
        return {
            name: other.name,
            match: otherPersonMatch[0],
        };
    }

    const initiatorPersonRegexp = new RegExp(
        initiator.name + "|" + initiator.aliases.join("|"),
        "i"
    );

    const initiatorPersonMatch = initiatorPersonRegexp.exec(message);
    if (initiatorPersonMatch) {
        return {
            name: initiator.name,
            match: initiatorPersonMatch[0],
        };
    }

    return {
        name: initiator.name,
        match: initiator.name,
    };
}
