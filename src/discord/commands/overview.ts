import { purchasesSheet } from "@app/spreadsheet/purchases/purchases-sheet";
import { format } from "date-fns";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
    .setName("overview")
    .setDescription("Displays a list of purchases from the past month");

export async function execute(interaction: CommandInteraction) {
    try {
        await interaction.deferReply();

        const purchases = await purchasesSheet.getAll();
        const completePurchases = purchases.filter(purchase => purchase.date && purchase.description && purchase.amount);
        
        const now = new Date();
        const purchasesThisMonth = completePurchases.filter(purchase => {
            const purchaseDate = new Date(purchase.date);
            return purchaseDate.getMonth() === now.getMonth() && purchaseDate.getFullYear() === now.getFullYear();
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (purchasesThisMonth.length === 0) {
            return interaction.editReply("No purchases found for the current month.");
        }

        const MAX_DESC = 100;
        const headers = ["Date", "Description", "Amount", "Paid by", "Split Type"];
        const rows = purchasesThisMonth.map(p => [
            format(new Date(p.date), "EEE, MMM d, yyyy"),
            p.description.length > MAX_DESC ? p.description.substring(0, MAX_DESC - 3) + "..." : p.description,
            `$${Number(p.amount).toFixed(2)}`,
            p.paidBy || "N/A",
            p.splitMethod || "N/A",
        ]);

        const colWidths = headers.map((header, i) => 
            Math.max(header.length, ...rows.map(row => row[i].length))
        );

        const createRow = (cells: string[]) => 
            "| " + cells.map((cell, i) => cell.padEnd(colWidths[i])).join(" | ") + " |";

        const separator = "+-" + colWidths.map(w => "-".repeat(w)).join("-+-") + "-+";

        const DISCORD_LIMIT = 1900; 
        const chunks: string[] = [];
        let currentTableRows = "";

        const getFullTable = (content: string) => `\`\`\`\n${separator}\n${createRow(headers)}\n${separator}\n${content}${separator}\n\`\`\``;

        for (const row of rows) {
            const rowString = createRow(row) + "\n";
            
            if (getFullTable(currentTableRows + rowString).length > DISCORD_LIMIT) {
                chunks.push(getFullTable(currentTableRows));
                currentTableRows = rowString;
            } else {
                currentTableRows += rowString;
            }
        }
        
        chunks.push(getFullTable(currentTableRows));

        for (const chunk of chunks) {
            await interaction.followUp(chunk);
        }
    } catch (error) {
        console.error("Error executing overview command:", error);
        return interaction.editReply("An error occurred while fetching purchase data.");
    }
}