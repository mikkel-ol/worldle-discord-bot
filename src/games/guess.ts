import { CacheType, CommandInteraction } from "discord.js";
import * as geolib from "geolib";
import { Logger } from "../common/logger";
import { LONGEST_DISTANCE } from "../constants/earth";
import { NO_OF_GUESSES } from "../constants/game";
import { countriesMap } from "../country/countries";
import { Country } from "../country/country";
import { generateEmbed, GuessEmbed } from "../embeds/generate-embed";
import { Config } from "../models/Config";
import { Game } from "../models/Game";
import { Guess } from "../models/Guess";
import { GameState } from "../types/GameState";
import { endCurrentGame } from "./end";

export const doGuess = async (interaction: CommandInteraction<CacheType>, guessedCountry: Country, currentGame: Game) => {
    const config = await Config.findOne({ where: { guildId: currentGame.guildId } });

    if (!config) {
        return Logger.error(`Could not found config for guild with ID ${currentGame.guildId}`);
    }

    // TODO: Check if user is on CD
    const allUserGuesses = await Guess.findAll({ where: { userId: interaction.user.id, gameId: currentGame.id } });
    const lastGuess = allUserGuesses.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
    const cd = config.cooldown ?? Number(process.env.DEFAULT_COOLDOWN_MINUTES);
    const cooldownUntil = new Date(lastGuess.createdAt.getTime() + cd * 60000).getTime();
    const remainingCooldown = cooldownUntil - new Date().getTime();

    if (!cd) throw new Error("Config has no CD and no default is set");

    // user is on cd
    if (remainingCooldown > 0) {
        return interaction.reply({ content: `You're on cooldown, guess again <t:${Math.floor(cooldownUntil / 1000)}:R>` });
    }

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

        currentGame.state = GameState.Solved;

        await currentGame.save();

        const guesses = await Guess.findAll({ where: { gameId: currentGame?.id } });

        const embedParams: GuessEmbed = {
            game: currentGame,
            guesses: guesses,
        };

        return interaction.reply({ embeds: [generateEmbed(interaction.client, embedParams)] });
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

    if (guesses.length === NO_OF_GUESSES) {
        // all guesses used
        endCurrentGame(interaction.client, currentGame, guesses);
    }

    const embedParams: GuessEmbed = {
        game: currentGame,
        guesses: guesses,
    };

    return interaction.reply({ embeds: [generateEmbed(interaction.client, embedParams)] });
};
