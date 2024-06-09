import { Message } from "discord.js";
import { getConfiguration } from "./spreadsheet";
import { insertNewPurchase } from "./insert-new-purchase";

export async function parseMessageIntoPurchase(message: Message) {
    try {
        const configFromWorksheet = await getConfiguration();

        const blacklistedKeywordsRegExp = new RegExp(
            `\\b(${configFromWorksheet.blacklistedKeywords.join("|")})\\b`,
            "ig"
        );

        const specialCharactersRegExp = new RegExp(/[^\w\s.]/g);

        const cleanedMessage = message.content
            .replace(blacklistedKeywordsRegExp, "")
            .replace(specialCharactersRegExp, "")
            .toLowerCase()
            .trim();

        const sourceDiscordId = message.author.id;

        const initiator = configFromWorksheet.people.find(
            (person) => person.discordId === sourceDiscordId
        );

        if (!initiator) {
            throw new Error(
                "Configuration file error: initiator was not found"
            );
        }

        const other = configFromWorksheet.people.find(
            (person) => person.discordId !== initiator.discordId
        );

        if (!other) {
            throw new Error(
                "Configuration file error: other person was not found"
            );
        }

        const otherPersonAsPurchaserRegExp = new RegExp(
            other?.name + "|" + other?.aliases.join("|"),
            "i"
        );
        const otherPersonAsPurchaserMatch =
            otherPersonAsPurchaserRegExp.exec(cleanedMessage);

        const purchaser = otherPersonAsPurchaserMatch ? other : initiator;

        const purchaseAmountRegExp = new RegExp(/\d+(\.\d+)?/);
        const purchaseAmountMatch = purchaseAmountRegExp.exec(cleanedMessage);

        if (!purchaseAmountMatch) {
            throw new Error("Purchase amount missing");
        }

        const categoryRegExp = new RegExp(
            configFromWorksheet.purchaseCategories
                .filter((category) => category.keywords.length > 0)
                .map((category) =>
                    category.keywords.concat(category.name).join("|")
                )
                .join("|"),
            "i"
        );

        const categoryMatch = categoryRegExp.exec(cleanedMessage);

        const category = categoryMatch
            ? configFromWorksheet.purchaseCategories.find(
                  (category) =>
                      category.name.toLowerCase() ===
                          categoryMatch[0].toLowerCase() ||
                      category.keywords
                          .map((keyword: string) => keyword.toLowerCase())
                          .includes(categoryMatch[0])
              )
            : configFromWorksheet.purchaseCategories.find(
                  (category) =>
                      category.name ===
                      configFromWorksheet.defaultPurchaseCategory
              );

        const purchaserRegExp = new RegExp(
            purchaser.name + "|" + purchaser.aliases.join("|"),
            "i"
        );

        const description = cleanedMessage
            .replace(purchaserRegExp, "")
            .replace(purchaseAmountMatch[0], "")
            .trim();
        const capitalizedDescription =
            description.charAt(0).toUpperCase() + description.slice(1);

        if (!description) {
            throw new Error("Description missing");
        }

        await insertNewPurchase(
            capitalizedDescription,
            category?.name || configFromWorksheet.defaultPurchaseCategory,
            "50/50",
            configFromWorksheet.people.indexOf(purchaser) === 0
                ? "person1"
                : "person2",
            Number(purchaseAmountMatch[0])
        );

        const response = `${purchaser.name} spent \$${purchaseAmountMatch[0]} at ${capitalizedDescription} in ${category?.name}`;
        return response;
    } catch (error: any) {
        return error.message;
    }
}
