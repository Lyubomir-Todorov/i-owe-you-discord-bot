import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { config } from "../config";
import { getCurrentMonthWorksheet, getWorksheet } from "src/spreadsheet";
import { commandMonthChoices } from "./command-month-choices";

export const data = new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Displays the balance of the current month")
    .addStringOption((option) =>
        option
            .setName("month")
            .setDescription("The month to display the balance for")
            .addChoices(...commandMonthChoices)
            .setRequired(false)
    );

export async function execute(interaction: CommandInteraction) {
    try {
        const monthArg = interaction.options.get("month");

        const worksheet = monthArg?.value
            ? await getWorksheet(monthArg.value.toString())
            : await getCurrentMonthWorksheet();

        await worksheet.loadCells(config.WORKSHEET_TOTAL_OWING_CELL);
        const value = worksheet.getCellByA1(
            config.WORKSHEET_TOTAL_OWING_CELL
        ).value;

        worksheet.resetLocalCache(true);

        if (!value) {
            throw new Error("Balance not found");
        }

        return interaction.reply(value.toString());
    } catch (error) {
        console.error(error);
        return interaction.reply({
            content: "An error occurred with this command.",
            ephemeral: true,
        });
    }
}
