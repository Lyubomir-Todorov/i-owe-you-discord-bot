/**
 * MessageOutput type. The resulting output after parsing the message.
 */
export type MessageOutput = {
    /**
     * The amount spent.
     */
    amount: string;
    /**
     * The category of the purchase.
     */
    category: string;
    /**
     * The description of the purchase.
     * This is usually the item or service purchased.
     */
    description: string;
    /**
     * The purchaser of the purchase.
     * This maps to the name of the person who made the purchase.
     */
    purchaser: "person1" | "person2";
};
