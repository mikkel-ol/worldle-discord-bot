import { Client, MessageEmbed } from "discord.js";
import { GREEN_SQUARE_EMOJI_ID, WHITE_SQUARE_EMOJI_ID, YELLOW_SQUARE_EMOJI_ID } from "../constants/emojis";
import { NO_OF_GUESSES } from "../constants/game";
import { NO_OF_SQUARES } from "../constants/messages";
import { Guess } from "../models/Guess";

export interface GuessEmbed {
    countryCode: string;
    startedTimeStamp: number;
    timeRemainingTimeStamp: number;
    guesses?: Guess[];
}

export const generateEmbed = (client: Client, params: GuessEmbed) => {
    const whiteSquareEmoji = client.emojis.cache.get(WHITE_SQUARE_EMOJI_ID);
    const yellowSquareEmoji = client.emojis.cache.get(YELLOW_SQUARE_EMOJI_ID);
    const greenSquareEmoji = client.emojis.cache.get(GREEN_SQUARE_EMOJI_ID);

    const whiteSquareEmojiString = Array(NO_OF_SQUARES).fill(whiteSquareEmoji).join("");
    const description = Array(NO_OF_GUESSES)
        .fill(whiteSquareEmojiString)
        .map((x, i) => `\`${i + 1}.\`${x}`);

    params.guesses?.forEach((guess, i) => {
        const noOfGreenSquares = Math.floor((guess.percentage - 1) / 10);
        const noOfYellowSquares = 1;
        const noOfWhiteSquares = NO_OF_SQUARES - noOfGreenSquares - noOfYellowSquares;

        description[i] =
            Array(noOfGreenSquares).fill(greenSquareEmoji).join("") +
            yellowSquareEmoji +
            Array(noOfWhiteSquares).fill(whiteSquareEmoji).join("");
    });

    const descriptionString = description.join("\n");

    const noOfGuessesLeft = NO_OF_GUESSES - ((params.guesses && params.guesses.length) ?? 0);

    const embed = new MessageEmbed()
        .setTitle(`Worldle for <t:${params.startedTimeStamp}>`)
        .setDescription(descriptionString)
        .addField("\u200b", `\`${noOfGuessesLeft}\` guesses remaining\nTime runs out <t:${params.timeRemainingTimeStamp}:R>`)
        .setFooter({ text: "Created by Scalz#0001" })
        .setImage(
            `https://raw.githubusercontent.com/mikkel-ol/worldle-discord-bot/293db7a/assets/countries/${params.countryCode.toLowerCase()}/1024.png`
        );

    return embed;
};
