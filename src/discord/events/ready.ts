import {deployCommands} from "../commands/deploy-commands";
import {Client} from "discord.js";
import {initializeGoogleSheetsClient} from "@app/google-sheets/initialize-google-sheets-client";
import {processScheduledPayments} from "@app/cron/process-scheduled-payments";

export async function onReady(client: Client) {
    if (!client.user) return;

    try {
        await initializeGoogleSheetsClient();
        processScheduledPayments.start();

        const guild = client.guilds.cache.first();

        if (guild) {
            await deployCommands({ guildId: guild.id });
        }
    } catch (error) {
        console.error("Error initializing spreadsheet", error);
    }
}