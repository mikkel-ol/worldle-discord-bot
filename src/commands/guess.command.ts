import { SlashCommandBuilder } from "@discordjs/builders";
import { countries } from "../domain/countries";
import { MAX_ALLOWED_COMMAND_CHOICES } from "./deploy-commands";

export const generateGuessCommand = () => {
    const builder = new SlashCommandBuilder().setName("guess").setDescription("Guess a country");

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
                .addChoices(chunk.map((country) => [country.name, country.code]))
        );
    });

    return builder;
};
