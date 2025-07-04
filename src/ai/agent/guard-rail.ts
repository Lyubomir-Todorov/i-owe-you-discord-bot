import {guardRailPrompt} from "@app/ai/prompts/guard-rail-prompt";
import {MessageLegitimacy} from "@app/models/message-legitimacy";
import {chat} from "@app/ai/agent/chat";
import {MessageLegitimacySchema} from "@app/ai/schemas/message-legitimacy-schema";

export async function guardRail(message: string): Promise<boolean> {
    const response = await chat({
        systemPrompt: guardRailPrompt,
        userPrompt: message,
        format: MessageLegitimacySchema,
        temperature: 0
    });

    const {isLegitimateRequest} = JSON.parse(response.message.content) as MessageLegitimacy;
    return isLegitimateRequest;
}