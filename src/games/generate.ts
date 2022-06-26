import { Client, TextChannel } from "discord.js";
import { Logger } from "../common/logger";
import { randCountry } from "../country/random-country";
import { generateEmbed, GuessEmbed } from "../embeds/generate-embed";
import { Config } from "../models/Config";
import { Game } from "../models/Game";
import { generateEpoch } from "../utils/epoch";

export const newGame = async (client: Client, config: Config) => {
    if (!config?.gameChannelId) return Logger.error(`No channel ID found on config ${config}`);

    // safe to cast to text channel since we don't save any other types to DB
    const channel = (await client.channels.fetch(config.gameChannelId)) as TextChannel;

    if (!channel) return Logger.error(`Could not fetch channel with ID ${config.gameChannelId}, got ${channel}`);

    const newCountry = randCountry();

    const newGame = await Game.create({
        active: true,
        guildId: config.guildId,
        countryId: newCountry.code,
    });

    const embedOptions: GuessEmbed = {
        channelId: config.gameChannelId,
        country: newCountry,
        startedTimeStamp: generateEpoch(),
        timeRemainingTimeStamp: generateEpoch(),
    };

    const embed = generateEmbed(client, embedOptions);

    // channel.send({ embeds: [embed] });
};
