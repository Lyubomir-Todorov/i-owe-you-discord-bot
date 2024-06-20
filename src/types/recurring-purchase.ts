import { Purchaser } from "./purchaser";

export type RecurringPurchase = {
    /** Whether the purchase is currently active */
    enabled: boolean;
    /** Description of the purchase */
    description: string;
    /** Total cost */
    amount: number;
    /** Category that the purchase belongs to*/
    category: string;
    /** Who purchased the item */
    purchaser: string;
    /** How often the purchase is made */
    frequency: RecurringPurchaseFrequency;
    /** Date of the last purchase */
    lastRunDate: Date | null;
};

export enum RecurringPurchaseFrequency {
    "Daily" = 1,
    "Weekly" = 7,
    "Bi-weekly" = 14,
    "Monthly" = 30,
    "Quarterly" = 90,
    "Semi-annually" = 180,
    "Yearly" = 365,
}
