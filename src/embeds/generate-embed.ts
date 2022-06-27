import { Client, MessageEmbed } from "discord.js";
import { Direction, directionMap } from "../constants/direction";
import { GREEN_SQUARE_EMOJI_ID, WHITE_SQUARE_EMOJI_ID, YELLOW_SQUARE_EMOJI_ID } from "../constants/emojis";
import { NO_OF_GUESSES } from "../constants/game";
import { NO_OF_SQUARES } from "../constants/messages";
import { countriesMap } from "../country/countries";
import { Guess } from "../models/Guess";

export interface GuessEmbed {
    countryCode: string;
    startedTimeStamp: number;
    timeRemainingTimeStamp: number;
    guesses?: Guess[];
    authorUsername?: string;
}

export const generateEmbed = (client: Client, params: GuessEmbed) => {
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

        description[i] =
            guessNumbering(i) +
            Array(noOfGreenSquares).fill(greenSquareEmoji).join("") +
            Array(noOfYellowSquares).fill(yellowSquareEmoji).join("") +
            Array(noOfWhiteSquares).fill(whiteSquareEmoji).join("") +
            " " +
            `[${countryGuess?.code}](https://www.google.com/search?q=${encodeURIComponent(countryGuess?.name ?? "")})` +
            " " +
            `${directionMap.get(guess.direction as Direction)}` +
            " " +
            `\`${distanceInKm.toLocaleString()}km\`` +
            " " +
            `<@${guess.userId}>`;
    });

    const descriptionString = description.join("\n");

    const noOfGuessesLeft = NO_OF_GUESSES - ((params.guesses && params.guesses.length) ?? 0);

    const embed = new MessageEmbed()
        .setTitle(`Worldle for <t:${params.startedTimeStamp}>`)
        .setDescription(descriptionString)
        .addField("\u200b", `\`${noOfGuessesLeft}\` guesses remaining\nTime runs out <t:${params.timeRemainingTimeStamp}:R>`)
        .setFooter({ text: `Created by ${params.authorUsername ?? "Scalz#0001"}` })
        .setImage(
            `https://raw.githubusercontent.com/mikkel-ol/worldle-discord-bot/293db7a/assets/countries/${params.countryCode.toLowerCase()}/1024.png`
        );

    return embed;
};
