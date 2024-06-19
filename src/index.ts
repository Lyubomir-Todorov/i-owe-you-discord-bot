import { Client, GatewayIntentBits } from "discord.js";
import { commands } from "./commands";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import { parseMessageIntoPurchase } from "./parse-message-into-purchase";
import { initializeSpreadsheet } from "./spreadsheet";
import { CronJob } from "cron";
import processRecurringPayments from "./spreadsheet/recurring-payments/process-recurring-payments";

const job = CronJob.from({
    cronTime: config.RECURRING_WORKSHEET_CRON,
    onTick: async function () {
        await processRecurringPayments();
    },
    start: false,
});

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
    ],
});

client.on("ready", async () => {
    if (!client.user) return;
    console.log(`Logged in as ${client.user.tag}`);

    try {
        await initializeSpreadsheet();
        job.start();
    } catch (error) {
        console.error("Error initializing spreadsheet", error);
    }
});

client.on("guildCreate", async (guild) => {
    console.log(`Joined guild: ${guild.name}`);
    await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) {
        return;
    }
    const { commandName } = interaction;
    if (commands[commandName as keyof typeof commands]) {
        commands[commandName as keyof typeof commands].execute(interaction);
    }
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    let response;
    try {
        response = await parseMessageIntoPurchase(message);
    } catch (error) {
        response =
            "An error occurred while processing your request. Please try again later.";
        console.error(error);
    }

    await message.reply(response);
});

client.login(config.DISCORD_TOKEN);
