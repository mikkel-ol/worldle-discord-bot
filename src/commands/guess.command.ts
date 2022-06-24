import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";
import { MAX_ALLOWED_COMMAND_CHOICES } from "../constants/max-command-choices";
import { countries } from "../domain/countries";

export const GUESS_COMMAND_NAME = "guess";

export const generateGuessCommand = () => {
    const builder = new SlashCommandBuilder().setName(GUESS_COMMAND_NAME).setDescription("Guess a country");

    const chunks = countries.sort((a, b) => a.name.localeCompare(b.name)).chunkize(MAX_ALLOWED_COMMAND_CHOICES);

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

export const guessCommandHandler = async (interaction: Interaction) => {
    //
};
