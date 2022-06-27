import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { Logger } from "../common/logger";
import { FAILURE_EMOJI } from "../constants/emojis";
import { generateEmbed, GuessEmbed } from "../embeds/generate-embed";
import { Game } from "../models/Game";
import { Guess } from "../models/Guess";

export const GAME_COMMAND_NAME = "game";

export const gameCommand = new SlashCommandBuilder().setName(GAME_COMMAND_NAME).setDescription("Get the current game");

export const gameCommandHandler = async (interaction: CommandInteraction<CacheType>) => {
    // ignore DM's
    if (!interaction.guildId) return;

    const currentGame = await Game.findOne({ where: { guildId: interaction.guildId, isActive: true } });

    if (!currentGame) {
        Logger.error(`No game found for guild with ID ${interaction.guildId}`);

        return interaction.reply({ content: `${FAILURE_EMOJI} No active game found`, ephemeral: true });
    }

    const guesses = await Guess.findAll({ where: { gameId: currentGame?.id } });

    const embedParams: GuessEmbed = {
        game: currentGame,
        guesses: guesses,
    };

    return interaction.reply({ embeds: [generateEmbed(interaction.client, embedParams)] });
};
