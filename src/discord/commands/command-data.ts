import {SlashCommandBuilder} from "discord.js";

export const commandData = [
    new SlashCommandBuilder()
        .setName("balance")
        .setDescription("Displays the current balance"),
    new SlashCommandBuilder()
        .setName("pay")
        .setDescription("Pay off any outstanding balances"),
    new SlashCommandBuilder()
        .setName("overview")
        .setDescription("Displays a list of purchases from the past month"),
];
