import { Client, Interaction } from "discord.js";
import { configCommandHandler, CONFIG_COMMAND_NAME } from "./config.command";
import { guessCommandHandler, GUESS_COMMAND_NAME } from "./guess.command";

const interactionHandlerMap = new Map<string, (interaction: Interaction) => unknown>([
    [CONFIG_COMMAND_NAME, configCommandHandler],
    [GUESS_COMMAND_NAME, guessCommandHandler],
]);

export const attachHandlers = (client: Client) =>
    client.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return;

        const handler = interactionHandlerMap.get(interaction.commandName);

        if (!handler) return console.warn(`No handler for command: '${interaction.commandName}'`);

        handler(interaction);
    });
