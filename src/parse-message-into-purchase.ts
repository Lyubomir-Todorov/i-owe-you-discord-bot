import { Message } from "discord.js";
import { insertNewPurchase } from "./insert-new-purchase";
import { parseMessage } from "./message/parse-message";
import { getConfiguration } from "./spreadsheet";

export async function parseMessageIntoPurchase(message: Message) {
    try {
        const configFromWorksheet = await getConfiguration();
        const sourceDiscordId = message.author.id;

        const initiator = configFromWorksheet.people.find(
            (person) => person.discordId === sourceDiscordId
        );
        if (!initiator) throw new Error("Initiator was not found");

        const other = configFromWorksheet.people.find(
            (person) => person.discordId !== initiator.discordId
        );

        if (!other) throw new Error("Other person was not found");

        const { purchaser, amount, description, category } = parseMessage({
            message: message.content,
            blacklistedKeywords: configFromWorksheet.blacklistedKeywords,
            categories: configFromWorksheet.purchaseCategories,
            fallbackCategory: configFromWorksheet.defaultPurchaseCategory,
            initiator,
            other,
        });

        await insertNewPurchase({
            purchaser,
            amount,
            description,
            category,
        });

        const name =
            purchaser === initiator.position ? initiator.name : other.name;

        const response = `${name} spent \$${amount} at ${description} in ${category}`;
        return response;
    } catch (error: any) {
        return error.message;
    }
}
