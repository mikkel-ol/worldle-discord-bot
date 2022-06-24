import { Client, Intents } from "discord.js";
import "dotenv/config";
import { attachHandlers, deployCommands } from "./commands";
import { Logger } from "./common/logger";
import { db } from "./database";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
    // TODO: Make sure a config exists for all servers
    db.sync()
        .then(() => Logger.success("Database synced"))
        .catch(Logger.error);

    deployCommands();

    attachHandlers(client);

    Logger.success("Logged in and ready!");
});

client.login(process.env.DISCORD_BOT_TOKEN);
