import { Purchaser } from "./purchaser";

export type RecurringPurchase = {
    /** Description of the purchase */
    description: string;
    /** Total cost */
    amount: number;
    /** Category that the purchase belongs to*/
    category: string;
    /** Who purchased the item */
    purchaser: Purchaser;
    /** How often the purchase is made */
    frequency: RecurringPurchaseFrequency;
    /** Date of the last purchase */
    lastRunDate: Date;
};

export enum RecurringPurchaseFrequency {
    Daily = 1,
    Weekly = 7,
    BiWeekly = 14,
    Monthly = 30,
    Quarterly = 90,
    SemiAnnually = 180,
    Yearly = 365,
}
