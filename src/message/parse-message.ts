import { MessageOutput, Person, PurchaseCategory } from "src/types";
import cleanMessage from "./clean-message";
import getPurchaseAmount from "./get-purchase-amount";
import getPurchaseCategory from "./get-purchase-category";
import getPurchaser from "./get-purchaser";
import getDescription from "./get-description";

export type Options = {
    message: string;
    blacklistedKeywords: string[];
    categories: PurchaseCategory[];
    fallbackCategory: string;
    initiator: Person;
    other: Person;
};

/**
 * Parses a message and extracts relevant information such as purchase amount, category, purchaser, and description.
 * @param options - The options object containing the message and other configuration parameters.
 * @returns The parsed message output containing the purchase amount, category, description, and purchaser.
 * @throws Error if the message is empty or if the purchase amount is missing.
 */
export function parseMessage(options: Options): MessageOutput {
    const {
        message,
        blacklistedKeywords,
        categories,
        fallbackCategory,
        initiator,
        other,
    } = options;

    // Remove any filler words and non-alphanumeric characters that do not help in identifying the purchase
    const cleanedMessage = cleanMessage(message, blacklistedKeywords);
    if (!cleanedMessage) throw new Error("Message is empty");

    // Purchase amount
    const purchaseAmount = getPurchaseAmount(cleanedMessage);
    if (!purchaseAmount) throw new Error("Purchase amount missing");
    const messageWithoutAmount = cleanedMessage.replace(purchaseAmount, "");

    // Category
    const category =
        getPurchaseCategory(messageWithoutAmount, categories) ||
        fallbackCategory;
    const messageWithoutCategory = messageWithoutAmount.replace(category, "");

    // Purchaser
    const purchaser = getPurchaser(messageWithoutCategory, initiator, other);
    console.log(purchaser);
    const messageWithoutPurchaser = messageWithoutCategory.replace(
        purchaser.match,
        ""
    );

    // Description
    const description = getDescription(messageWithoutPurchaser);
    if (!description) throw new Error("Description missing");

    return {
        amount: purchaseAmount,
        category,
        description,
        purchaser: initiator.name === purchaser.name ? "person1" : "person2",
    };
}
