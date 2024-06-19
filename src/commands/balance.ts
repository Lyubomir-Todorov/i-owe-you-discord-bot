import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { config } from "../config";
import { getCurrentMonthWorksheet } from "src/spreadsheet";

export const data = new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Displays the balance of the current month");

export async function execute(interaction: CommandInteraction) {
    try {
        const worksheet = await getCurrentMonthWorksheet();
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
