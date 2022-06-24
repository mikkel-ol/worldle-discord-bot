import { Client, Intents } from "discord.js";
import "dotenv/config";
import { deployCommands } from "./commands/deploy-commands";
import { attachHandlers } from "./commands/interactions";
import { Logger } from "./common/logger";
import { initDatabase } from "./database";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
    initDatabase()
        .then(() => Logger.success("Database synced"))
        .catch(Logger.error);

    deployCommands();

    attachHandlers(client);

    Logger.success("Logged in and ready!");
});

client.login(process.env.DISCORD_BOT_TOKEN);
