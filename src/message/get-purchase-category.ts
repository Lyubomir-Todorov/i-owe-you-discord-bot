import { PurchaseCategory } from "src/types";

/**
 * Retrieves the purchase category based on the given message and categories.
 * @param message - The message to search for the purchase category.
 * @param categories - The array of purchase categories to search in.
 * @returns The name of the matching purchase category, or undefined if no match is found.
 */
export default function getPurchaseCategory(
    message: string,
    categories: PurchaseCategory[]
): string | undefined {
    const categoryRegExp = new RegExp(
        categories
            .filter((category) => category.keywords.length > 0)
            .map((category) =>
                category.keywords.concat(category.name).join("|")
            )
            .join("|"),
        "i"
    );

    const categoryMatch = categoryRegExp.exec(message);

    if (!categoryMatch) {
        return undefined;
    }

    return categories.find(
        (category) =>
            category.name.toLowerCase() === categoryMatch[0].toLowerCase() ||
            category.keywords
                .map((keyword: string) => keyword.toLowerCase())
                .includes(categoryMatch[0])
    )!.name;
}
