import { Client, GatewayIntentBits } from "discord.js";
import { config } from "./config";
import { deployCommands } from "./deploy-commands";
import { commands } from "./commands";
import { getConfiguration, initializeSpreadsheet } from "./spreadsheet";
import { parseMessageIntoPurchase } from "./parse-message-into-purchase";

const client = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildIntegrations,
    ],
});

client.on("ready", () => {
    if (!client.user) return;
    console.log(`Logged in as ${client.user.tag}`);

    try {
        initializeSpreadsheet();
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
