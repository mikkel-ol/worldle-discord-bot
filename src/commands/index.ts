import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { CacheType, Client, CommandInteraction } from "discord.js";
import { Logger } from "../common/logger";
import { DISCORD_CLIENT_ID } from "../env/client-id";
import { DISCORD_BOT_TOKEN } from "../env/token";
import { ArgumentError } from "../errors/argument.error";
import "../extensions";
import { configCommand, configCommandHandler, CONFIG_COMMAND_NAME } from "./config.command";
import { gameCommand, gameCommandHandler, GAME_COMMAND_NAME } from "./game.command";
import { generateGuessCommand, guessCommandHandler, GUESS_COMMAND_NAME } from "./guess.command";

const commands = [generateGuessCommand(), configCommand, gameCommand];

export const deployCommands = () => {
    if (!DISCORD_BOT_TOKEN) throw new ArgumentError(`Discord bot token not set`);
    if (!DISCORD_CLIENT_ID) throw new ArgumentError(`Discord client ID not set`);

    const rest = new REST({ version: "9" }).setToken(DISCORD_BOT_TOKEN);

    rest.put(Routes.applicationCommands(DISCORD_CLIENT_ID), {
        body: commands,
    })
        .then(() => Logger.success("Registered application commands"))
        .catch(Logger.error);
};

const interactionHandlerMap = new Map<string, (interaction: CommandInteraction<CacheType>) => unknown>([
    [CONFIG_COMMAND_NAME, configCommandHandler],
    [GUESS_COMMAND_NAME, guessCommandHandler],
    [GAME_COMMAND_NAME, gameCommandHandler],
]);

export const attachHandlers = (client: Client) =>
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        const handler = interactionHandlerMap.get(interaction.commandName);

        if (!handler) return console.warn(`No handler for command: '${interaction.commandName}'`);

        handler(interaction);
    });
