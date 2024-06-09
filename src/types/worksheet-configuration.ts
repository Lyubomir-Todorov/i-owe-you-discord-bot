import { Person } from "./person";
import { PurchaseCategory } from "./purchase-category";

/**
 * WorksheetConfiguration type.
 * Represents the configuration settings in the worksheet.
 */
export type WorksheetConfiguration = {
    /**
     * Configuration properties for the two people involved in the spreadsheet.
     * @see Person
     */
    people: Person[];
    /**
     * The available purchase categories that a purchase can belong to.
     * @see PurchaseCategory
     */
    purchaseCategories: PurchaseCategory[];
    /**
     * The name of the default purchase category, in the case no category or category keywords are mentioned.
     */
    defaultPurchaseCategory: string;
    /**
     * Filler words that can be ignored when parsing the message.
     */
    blacklistedKeywords: string[];
};
