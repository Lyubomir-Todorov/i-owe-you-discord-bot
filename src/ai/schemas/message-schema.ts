import {SplitType} from "@app/enums/split-type";

export const MessageSchema = {
    type: "object",
    properties: {
        paidBy: {
            type: "string",
            description: "The name of the person who made the purchase."
        },
        descriptionOfPurchase: {
            type: "string",
            description: "Description of the purchase."
        },
        amount: {
            type: "number",
            description: "How much was spent on the purchase."
        },
        category: {
            type: "string",
            description: "What category the purchase belongs to."
        },
        splitMethod: {
            type: "string",
            description: "How the purchase is intended to be split.",
            enum: [
                SplitType.HALF.valueOf(),
                SplitType.FULL.valueOf()
            ]
        }
    },
    required: [
        "paidBy",
        "descriptionOfPurchase",
        "amount",
        "category",
        "splitMethod"
    ]
};