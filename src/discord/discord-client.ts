import {Client, GatewayIntentBits, Options, Partials} from "discord.js";

export const discordClient = new Client({
    intents: [
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [
        Partials.Message,
        Partials.Channel,
    ],
    makeCache: Options.cacheWithLimits({
        MessageManager: 0,
        GuildMemberManager: {
            maxSize: 0,
            keepOverLimit: member => member.id === member.client.user.id,
        },
        UserManager: {
            maxSize: 0,
            keepOverLimit: user => user.id === user.client.user.id,
        },
        ReactionManager: 0,
        GuildMessageManager: 0,
        PresenceManager: 0,
        ThreadManager: 0,
        ThreadMemberManager: 0,
        VoiceStateManager: 0,
        StageInstanceManager: 0,
        GuildEmojiManager: 0,
        GuildStickerManager: 0,
        GuildBanManager: 0,
        GuildInviteManager: 0,
        GuildScheduledEventManager: 0,
        AutoModerationRuleManager: 0,
        ApplicationCommandManager: 0,
    }),
    sweepers: {
        ...Options.DefaultSweeperSettings,
        messages: {interval: 300, lifetime: 120},
        threads: {interval: 3600, lifetime: 1800},
    },
});
