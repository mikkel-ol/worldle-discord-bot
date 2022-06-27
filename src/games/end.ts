import { Client, TextChannel } from "discord.js";
import { Logger } from "../common/logger";
import { generateEmbed, GuessEmbed } from "../embeds/generate-embed";
import { Config } from "../models/Config";
import { Game } from "../models/Game";
import { Guess } from "../models/Guess";

export const endCurrentGame = async (client: Client, config: Config) => {
    const currentGame = await Game.findOne({ where: { guildId: config.guildId, isActive: true } });

    if (!currentGame) {
        return Logger.error(`No game found for guild ${config.guildId}`);
    }

    currentGame.isActive = false;
    await currentGame.save();

    const guesses = await Guess.findAll({ where: { gameId: currentGame.id } });

    const embedOptions: GuessEmbed = {
        game: currentGame,
        guesses: guesses,
    };

    const embed = generateEmbed(client, embedOptions);

    const channel = (await client.channels.fetch(config.gameChannelId ?? "")) as TextChannel;

    if (!channel) {
        Logger.error(`Could not fetch channel with ID ${config.gameChannelId}`);
    }

    return channel.send({ embeds: [embed] });
};
