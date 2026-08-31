import {deployCommands} from "@app/discord/commands/deploy-commands";
import {config} from "@app/config";

async function main() {
    if (!config.DISCORD_GUILD_ID) {
        throw new Error("DISCORD_GUILD_ID is not set in the environment variables");
    }

    await deployCommands({guildId: config.DISCORD_GUILD_ID});
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error("Failed to deploy commands", error);
        process.exit(1);
    });
