import {SplitType} from "@app/enums/split-type";

export type ParsedMessage = {
    paidBy: string;
    descriptionOfPurchase: string;
    amount: number;
    category: string;
    splitMethod: SplitType;
}