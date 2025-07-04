import {chat} from "@app/ai/agent/chat";
import {MessageSchema} from "@app/ai/schemas/message-schema";
import {systemPrompt} from "@app/ai/prompts/system-prompt";
import {ParsedMessage} from "@app/models/parsed-message";
import {categorySheet} from "@app/spreadsheet/categories/category-sheet";
import {peopleSheet} from "@app/spreadsheet/people/people-sheet";

export async function parseMessage(message: string, discordId: string): Promise<ParsedMessage> {

    const [categories, people] = await Promise.all([
        categorySheet.getAll(),
        peopleSheet.getAll()
    ]);

    const response = await chat({
        systemPrompt: systemPrompt(
            JSON.stringify(categories),
            JSON.stringify(people),
        ),
        userPrompt: message + `\n\nDiscord ID: ${discordId}`,
        format: MessageSchema,
        temperature: 0
    });

    return JSON.parse(response.message.content) as ParsedMessage;
}