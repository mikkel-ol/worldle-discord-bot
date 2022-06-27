import { CacheType, CommandInteraction } from "discord.js";
import * as geolib from "geolib";
import { LONGEST_DISTANCE } from "../constants/earth";
import { countriesMap } from "../country/countries";
import { Country } from "../country/country";
import { generateEmbed, GuessEmbed } from "../embeds/generate-embed";
import { Game } from "../models/Game";
import { Guess } from "../models/Guess";

export const doGuess = async (interaction: CommandInteraction<CacheType>, guessedCountry: Country, currentGame: Game) => {
    // succesful guess
    if (currentGame.countryId === guessedCountry.code) {
        const newGuess = await Guess.create({
            gameId: currentGame.id,
            countryId: guessedCountry.code,
            userId: interaction.user.id,
            direction: "0",
            distance: 0,
            percentage: 100,
        });

        // TODO: Finish game

        return interaction.reply("success");
    }

    // unsuccesful guess

    // safe typecasting since we know we will have a valid code in DB
    const correctCountry = countriesMap.get(currentGame.countryId) as Country;

    const distanceInMeters = geolib.getDistance(guessedCountry, correctCountry);
    const direction = geolib.getCompassDirection(
        guessedCountry,
        correctCountry,
        (origin, dest) => Math.round(geolib.getRhumbLineBearing(origin, dest) / 45) * 45
    );
    const percentage = 100 - Math.floor((distanceInMeters / 1000 / LONGEST_DISTANCE) * 100);

    const newGuess = await Guess.create({
        gameId: currentGame.id,
        countryId: guessedCountry.code,
        userId: interaction.user.id,
        direction: direction,
        distance: distanceInMeters,
        percentage: percentage,
    });

    const guesses = await Guess.findAll({ where: { gameId: currentGame?.id } });

    const embedParams: GuessEmbed = {
        countryCode: currentGame.countryId,
        startedTimeStamp: currentGame.started,
        timeRemainingTimeStamp: currentGame.expiration,
        guesses: guesses,
    };

    return interaction.reply({ embeds: [generateEmbed(interaction.client, embedParams)] });
};
