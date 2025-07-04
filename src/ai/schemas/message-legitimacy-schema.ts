export const MessageLegitimacySchema = {
    type: "object",
    properties: {
        isLegitimateRequest: {
            type: "boolean",
            description: "Whether the message is a legitimate request or not.",
        },
    },
    required: [
        "isLegitimateRequest",
    ]
}