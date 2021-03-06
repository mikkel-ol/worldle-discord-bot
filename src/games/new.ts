import { Client, TextChannel } from "discord.js";
import { Logger } from "../common/logger";
import { randCountry } from "../country/random-country";
import { generateEmbed, GuessEmbed } from "../embeds/generate-embed";
import { Config } from "../models/Config";
import { Game } from "../models/Game";
import { GameState } from "../types/GameState";
import { addHours } from "../utils/add-hours";
import { generateEpoch } from "../utils/epoch";

export const newGame = async (client: Client, config: Config) => {
    if (!config?.gameChannelId) return Logger.error(`No channel ID found on config ${config}`);

    // safe to cast to text channel since we don't save any other types to DB
    const channel = (await client.channels.fetch(config.gameChannelId)) as TextChannel;

    if (!channel) return Logger.error(`Could not fetch channel with ID ${config.gameChannelId}, got ${channel}`);

    const hasExistingGame = await Game.findOne({ where: { guildId: config.guildId, state: GameState.Active } });

    if (hasExistingGame) {
        return Logger.info(`There is already an existing game for guild with ID ${config.guildId}`);
    }

    const newCountry = randCountry();

    const started = generateEpoch();
    const expiration = generateEpoch(addHours(config?.interval ?? Number(process.env.DEFAULT_INTERVAL_HOURS) ?? 0));

    const newGame = await Game.create({
        state: GameState.Active,
        guildId: config.guildId,
        countryId: newCountry.code,
        started: started,
        expiration: expiration,
    });

    const embedOptions: GuessEmbed = {
        game: newGame,
    };

    const embed = generateEmbed(client, embedOptions);

    channel.send({ embeds: [embed] });
};
