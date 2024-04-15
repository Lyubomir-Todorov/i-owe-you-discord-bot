import { Person } from "./person";
import { PurchaseCategory } from "./purchase-category";

export type WorksheetConfiguration = {
    people: Person[];
    purchaseCategories: PurchaseCategory[];
    defaultPurchaseCategory: string;
    blacklistedKeywords: string[];
};
