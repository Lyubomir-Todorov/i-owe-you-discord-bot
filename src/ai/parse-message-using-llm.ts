import {ParsedMessage} from "@app/models/parsed-message";
import {SYSTEM_PROMPT} from "@app/ai/system-prompt";
import {Category} from "@app/models/category";
import {config as environmentConfig} from "@app/config";
import {Anthropic} from "@anthropic-ai/sdk";

const MODEL = 'claude-haiku-4-5'

export async function parseMessageUsingLLM(message: string, allCategories: Category[], defaultCategory: string): Promise<ParsedMessage> {
    const client = new Anthropic({
        apiKey: environmentConfig.ANTHROPIC_API_KEY
    });

    console.info(`Using ${MODEL} to parse user message...`)

    const output = await client.messages.parse({
        max_tokens: 1024,
        system: SYSTEM_PROMPT(JSON.stringify(allCategories), defaultCategory),
        messages: [
            {
                role: "user", content: message
            }
        ],
        model: MODEL,
        output_config: {
            format: {
                type: "json_schema",
                schema: {
                    type: "object",
                    properties: {
                        paidBy: {type: "string"},
                        purchaseDescription: {type: "string"},
                        purchaseAmount: {type: "number"},
                        category: {type: "string"},
                    },
                    required: ["paidBy", "purchaseDescription", "purchaseAmount", "category"],
                    additionalProperties: false
                }
            }
        }
    });

    console.info(`Used ${output.usage.output_tokens} tokens to perform operation`);

    if (!output.parsed_output) {
        throw new Error('Failed to parse message using LLM');
    }

    return {
        paidBy: output.parsed_output['paidBy'],
        descriptionOfPurchase: output.parsed_output['purchaseDescription'],
        amount: output.parsed_output['purchaseAmount'],
        category: output.parsed_output['category'],
    };
}