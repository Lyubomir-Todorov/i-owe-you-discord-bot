export type ScheduledPayment = {
    enabled: boolean;
    purchase: string;
    amount: number;
    category: string;
    paidBy: string;
    frequency: string;
    lastPaid?: Date;
}