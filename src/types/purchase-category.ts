/**
 * Purchase category type.
 * Represents a category that a purchase can belong to.
 */
export type PurchaseCategory = {
    /**
     * The name of the category.
     */
    name: string;
    /**
     * The keywords that can be used to identify the category.
     * This allows us to match the category without explicitly mentioning it in the message.
     */
    keywords: string[];
};
