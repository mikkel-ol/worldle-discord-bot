import { Client, Intents } from "discord.js";
import "dotenv/config";
import { deployCommands } from "./commands/deploy-commands";
import { Logger } from "./common/logger";

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.once("ready", () => {
    deployCommands();
    Logger.success("Logged in and ready!");
});

client.login(process.env.DISCORD_BOT_TOKEN);
