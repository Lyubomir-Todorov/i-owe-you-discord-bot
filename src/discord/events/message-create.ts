import {ActionRowBuilder, bold, ButtonBuilder, ButtonStyle, codeBlock, Message} from "discord.js";
import {purchasesSheet} from "@app/spreadsheet/purchases/purchases-sheet";
import {guardRail} from "@app/ai/agent/guard-rail";
import {parseMessage} from "@app/ai/agent/parse-message";
import {CustomId} from "@app/discord/enums/custom-id";
import {config} from "@app/config";
import {computationSheet} from "@app/spreadsheet/computations/computation-sheet";
import {Computations} from "@app/spreadsheet/enums/computations";

export async function onMessageCreate(message: Message) {
    if (message.author.bot) return;

    try {
        const fallbackCategoryPromise = computationSheet.getById(Computations.DEFAULT_CATEGORY);
        const processingMessagePromise = message.reply("Processing your request...");

        const isLegitimateRequest = await guardRail(message.content);

        if (!isLegitimateRequest) {
            const processingMessage = await processingMessagePromise;
            processingMessage.edit("Your request does not meet the necessary criteria for processing. Please ensure your message is clear and relevant.").then();
            return;
        }

        const response = await parseMessage(message.content, message.author.id)
        const {descriptionOfPurchase, amount, category, paidBy, splitMethod} = response;

        const fallbackCategory = await fallbackCategoryPromise;
        const processingMessage = await processingMessagePromise;

        const payee = paidBy || message.author.username;
        const actualCategory = category || fallbackCategory?.value || "";

        await purchasesSheet.insert({
            date: new Date(),
            description: descriptionOfPurchase,
            amount: amount,
            category: actualCategory,
            paidBy: payee,
            splitMethod: splitMethod || config.SPLIT_TYPE_HALF,
            transactionId: processingMessage.id
        });

        const editButton = new ButtonBuilder()
            .setCustomId(CustomId.EDIT_BUTTON)
            .setLabel('Edit')
            .setStyle(ButtonStyle.Secondary);

        const deleteButton = new ButtonBuilder()
            .setCustomId(CustomId.DELETE_BUTTON)
            .setLabel('Delete')
            .setStyle(ButtonStyle.Danger);

        const rows = [
            new ActionRowBuilder<ButtonBuilder>().addComponents(editButton, deleteButton),
        ]

        await processingMessage.edit({
            content: `${bold(payee)} spent ${bold(amount.toFixed(2))} in ${bold(actualCategory)} on the following: ${codeBlock(descriptionOfPurchase)}`,
            components: [...rows]
        });
        await processingMessage.react('✅');
    } catch (error) {
        await message.reply("An error occurred while processing your request. Please try again later.");
        console.error(error);
    }

}