import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { config } from "../config";
import { getConfiguration, getCurrentMonthWorksheet, getWorksheet } from "../spreadsheet";
import { insertNewPurchase } from "src/insert-new-purchase";
import { commandMonthChoices } from "./command-month-choices";

export const data = new SlashCommandBuilder()
    .setName("pay")
    .setDescription("Pay off any outstanding balances for the current month")
    .addStringOption((option) =>
        option
            .setName("month")
            .setDescription("The month to pay off the balance for")
            .addChoices(...commandMonthChoices)
            .setRequired(false)
    );

export async function execute(interaction: CommandInteraction) {
    try {
        const monthArg = interaction.options.get("month");

        const worksheet = monthArg?.value
            ? await getWorksheet(monthArg.value.toString())
            : await getCurrentMonthWorksheet();

        const configuration = await getConfiguration();
        await worksheet.loadCells(config.WORKSHEET_TOTAL_OWING_CELL);
        const value = worksheet
            .getCellByA1(config.WORKSHEET_TOTAL_OWING_CELL)
            .value?.toString();

        worksheet.resetLocalCache(true);

        if (!value) {
            throw new Error("Balance not found");
        }

        const amountOwedRegExp = new RegExp(/\d+(\.\d+)?/);
        const amountOwedMatch = amountOwedRegExp.exec(value);

        if (!amountOwedMatch) {
            return interaction.reply("No amount owed");
        }

        const initiator = configuration.people.find(
            (person) => person.discordId === interaction.user.id
        );

        if (!initiator) {
            throw new Error(
                "Configuration file error: initiator was not found"
            );
        }

        const other = configuration.people.find(
            (person) => person.discordId !== initiator.discordId
        );

        if (!other) {
            throw new Error(
                "Configuration file error: other person was not found"
            );
        }

        const personOwingRegExp = new RegExp(`${initiator.name} pays`, "i");
        const personOwingMatch = personOwingRegExp.exec(value);

        if (!personOwingMatch) {
            return interaction.reply("No amount owed");
        }

        await insertNewPurchase({
            description: "#PAYMENT#",
            category: "Payment",
            purchaser:
                configuration.people.indexOf(initiator) === 0
                    ? "person1"
                    : "person2",
            amount: amountOwedMatch[0],
        });

        return interaction.reply(
            `${initiator.name} has paid off their balance of \$${amountOwedMatch[0]}`
        );
    } catch (error) {
        console.error(error);
        return interaction.reply({
            content: "An error occurred with this command.",
            ephemeral: true,
        });
    }
}
