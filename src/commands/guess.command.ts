import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction } from "discord.js";
import { Logger } from "../common/logger";
import { FAILURE_EMOJI } from "../constants/emojis";
import { MAX_ALLOWED_COMMAND_CHOICES } from "../constants/max-command-choices";
import { countriesArray, countriesMap } from "../country/countries";
import { doGuess } from "../games/guess";
import { Game } from "../models/Game";

export const GUESS_COMMAND_NAME = "guess";

export const generateGuessCommand = () => {
    const builder = new SlashCommandBuilder().setName(GUESS_COMMAND_NAME).setDescription("Guess a country");

    const chunks = countriesArray.sort((a, b) => a.name.localeCompare(b.name)).chunkize(MAX_ALLOWED_COMMAND_CHOICES);

    chunks.forEach((chunk) => {
        const firstLetterOfFirstCountry = chunk.first().name.charAt(0);
        const firstLetterOfLastCountry = chunk.last().name.charAt(0);
        const optionText = `${firstLetterOfFirstCountry.toLowerCase()}-${firstLetterOfLastCountry.toLowerCase()}`;
        const descriptionText = `Countries from ${firstLetterOfFirstCountry.toUpperCase()}-${firstLetterOfLastCountry.toUpperCase()}`;

        builder.addStringOption((option) =>
            option
                .setName(optionText)
                .setDescription(descriptionText)
                .addChoices(...chunk.map((country) => ({ name: country.name, value: country.code })))
        );
    });

    return builder;
};

export const guessCommandHandler = async (interaction: CommandInteraction<CacheType>) => {
    // ignore DM's
    if (!interaction.guildId) return;

    // no arguments - reject
    if (interaction.options.data.length === 0) {
        return interaction.reply({ content: `${FAILURE_EMOJI} No country selected`, ephemeral: true });
    }

    const guessCountryCode = interaction.options.data[0].value as string;
    const guessCountry = countriesMap.get(guessCountryCode);

    if (!guessCountry) {
        Logger.error(`Could not found country with code ${guessCountry}`);

        return interaction.reply({
            content: `${FAILURE_EMOJI} Something with wrong.. tried to guess country with code ${guessCountryCode}`,
            ephemeral: true,
        });
    }

    const currentGame = await Game.findOne({ where: { guildId: interaction.guildId, isActive: true } });

    if (!currentGame) {
        Logger.error(`No game found for guild with ID ${interaction.guildId}`);

        return interaction.reply({ content: `${FAILURE_EMOJI} No active game found`, ephemeral: true });
    }

    return doGuess(interaction, guessCountry, currentGame);
};
