/**
 * Cleans a message by removing blacklisted keywords and special characters,
 * and converting it to lowercase.
 *
 * @param message - The message to be cleaned.
 * @param blacklistedKeywords - An array of blacklisted keywords to be removed from the message.
 * @returns The cleaned message.
 */
export default function cleanMessage(
    message: string,
    blacklistedKeywords: string[]
): string {
    const blacklistedKeywordsRegExp = new RegExp(
        `\\b(${blacklistedKeywords.join("|")})\\b`,
        "ig"
    );

    const specialCharactersRegExp = new RegExp(/[^\w\s.]/g);

    return message
        .replace(blacklistedKeywordsRegExp, "")
        .replace(specialCharactersRegExp, "")
        .replace(/\s+/g, " ")
        .toLowerCase()
        .trim();
}
