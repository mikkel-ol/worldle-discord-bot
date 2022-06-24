import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import { Logger } from "../common/logger";
import { DISCORD_CLIENT_ID } from "../env/client-id";
import { DISCORD_BOT_TOKEN } from "../env/token";
import { ArgumentError } from "../errors/argument.error";
import "../extensions";
import { addCountryOptions } from "./countries.command";

const countryCommandBuilder = new SlashCommandBuilder().setName("guess").setDescription("Guess a country");

const commands = [addCountryOptions(countryCommandBuilder)];

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
