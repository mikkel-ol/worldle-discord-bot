import { Client, MessageEmbed } from "discord.js";
import { Direction, directionMap } from "../constants/direction";
import { GREEN_SQUARE_EMOJI_ID, PARTY_EMOJI, WHITE_SQUARE_EMOJI_ID, YELLOW_SQUARE_EMOJI_ID } from "../constants/emojis";
import { NO_OF_GUESSES } from "../constants/game";
import { NO_OF_SQUARES } from "../constants/messages";
import { countriesMap } from "../country/countries";
import { Country } from "../country/country";
import { Game } from "../models/Game";
import { Guess } from "../models/Guess";
import { GameState } from "../types/GameState";

export interface GuessEmbed {
    game: Game;
    guesses?: Guess[];
    authorUsername?: string;
}

export const generateEmbed = (client: Client, params: GuessEmbed) => {
    const correctCountry = countriesMap.get(params.game.countryId) as Country;
    const correctGuess = params.guesses?.find((x) => x.distance === 0);
    const whiteSquareEmoji = client.emojis.cache.get(WHITE_SQUARE_EMOJI_ID);
    const yellowSquareEmoji = client.emojis.cache.get(YELLOW_SQUARE_EMOJI_ID);
    const greenSquareEmoji = client.emojis.cache.get(GREEN_SQUARE_EMOJI_ID);
    const guessNumbering = (i: number) => `\`${i + 1}.\``;

    const whiteSquareEmojiString = Array(NO_OF_SQUARES).fill(whiteSquareEmoji).join("");
    const description = Array(NO_OF_GUESSES)
        .fill(whiteSquareEmojiString)
        .map((x, i) => `${guessNumbering(i)}${x}`);

    params.guesses?.forEach(async (guess, i) => {
        const isCorrectGuess = guess.distance === 0;
        const noOfYellowSquares = isCorrectGuess ? 0 : 1;
        const noOfGreenSquares = Math.floor((guess.percentage - noOfYellowSquares) / (100 / NO_OF_SQUARES));
        const noOfWhiteSquares = NO_OF_SQUARES - noOfGreenSquares - noOfYellowSquares;
        const countryGuess = countriesMap.get(guess.countryId);
        const distanceInKm = Math.floor(guess.distance / 1000);

        const countryString = ` [${countryGuess?.code}](https://www.google.com/search?q=${encodeURIComponent(countryGuess?.name ?? "")})`;

        const incorrectGuessString =
            countryString + ` ${directionMap.get(guess.direction as Direction)}` + ` \`${distanceInKm.toLocaleString()}km\``;

        const correctGuessString = countryString + " " + PARTY_EMOJI;

        description[i] =
            guessNumbering(i) +
            Array(noOfGreenSquares).fill(greenSquareEmoji).join("") +
            Array(noOfYellowSquares).fill(yellowSquareEmoji).join("") +
            Array(noOfWhiteSquares).fill(whiteSquareEmoji).join("") +
            (isCorrectGuess ? correctGuessString : incorrectGuessString) +
            ` <@${guess.userId}>`;
    });

    const descriptionString = description.join("\n");

    console.log(params.game.state);

    const noOfGuessesLeft = NO_OF_GUESSES - ((params.guesses && params.guesses.length) ?? 0);
    const color = params.game.state === GameState.Active ? "YELLOW" : params.game.state === GameState.Solved ? "DARK_GREEN" : "DARK_RED";

    const middleField =
        params.game.state === GameState.Active
            ? `\`${noOfGuessesLeft}\` guesses remaining\nTime runs out <t:${params.game.expiration}:R>`
            : params.game.state === GameState.TimeIsUp
            ? `Time is up! The correct answer was \`${correctCountry.name}\``
            : params.game.state === GameState.Failed
            ? `No more guesses! The correct answer was \`${correctCountry.name}\``
            : `Winner winner chicken dinner! <@${correctGuess?.userId}>\nNext game <t:${params.game.expiration}:R>`;

    const embed = new MessageEmbed()
        .setTitle(`Worldle for <t:${params.game.started}>`)
        .setDescription(descriptionString)
        .addField("\u200b", middleField)
        .setFooter({ text: `Created by ${params.authorUsername ?? "Scalz#0001"}` })
        .setColor(color)
        .setImage(
            `https://raw.githubusercontent.com/mikkel-ol/worldle-discord-bot/293db7a/assets/countries/${params.game.countryId.toLowerCase()}/1024.png`
        );

    return embed;
};
