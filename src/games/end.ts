import { Client, TextChannel } from "discord.js";
import { Logger } from "../common/logger";
import { NO_OF_GUESSES } from "../constants/game";
import { generateEmbed, GuessEmbed } from "../embeds/generate-embed";
import { Config } from "../models/Config";
import { Game } from "../models/Game";
import { Guess } from "../models/Guess";
import { GameState } from "../types/GameState";
import { generateEpoch } from "../utils/epoch";

export const endCurrentGame = async (client: Client, game: Game, guesses: Guess[]) => {
    if (guesses.length === NO_OF_GUESSES) game.state = GameState.Failed;
    else if (game.expiration > generateEpoch()) game.state = GameState.TimeIsUp;
    else game.state === GameState.Solved;

    await game.save();

    const embedOptions: GuessEmbed = {
        game,
        guesses,
    };

    const embed = generateEmbed(client, embedOptions);

    const config = await Config.findOne({ where: { guildId: game.guildId } });

    if (!config) {
        return Logger.error(`Could not find config for guild with ID ${game.guildId}`);
    }

    const channel = (await client.channels.fetch(config.gameChannelId ?? "")) as TextChannel;

    if (!channel) {
        Logger.error(`Could not fetch channel with ID ${config.gameChannelId}`);
    }

    return channel.send({ embeds: [embed] });
};
