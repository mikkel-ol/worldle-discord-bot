import { Client, MessageEmbed } from "discord.js";
import { WHITE_SQUARE_EMOJI_ID } from "../constants/emojis";
import { NO_OF_GUESSES } from "../constants/game";
import { NO_OF_WHITE_SQUARES } from "../constants/messages";
import { Country } from "../country/country";

export interface GuessEmbed {
    channelId: string;
    country: Country;
    startedTimeStamp: number;
    timeRemainingTimeStamp: number;
}

export const generateEmbed = (client: Client, params: GuessEmbed) => {
    const whiteSquareEmoji = client.emojis.cache.get(WHITE_SQUARE_EMOJI_ID);
    const whiteSquareEmojiString = Array(NO_OF_WHITE_SQUARES).fill(whiteSquareEmoji).join("");
    const description = Array(NO_OF_GUESSES)
        .fill(whiteSquareEmojiString)
        .map((x, i) => `\`${i + 1}.\`${x}`)
        .join("\n");

    const embed = new MessageEmbed()
        .setTitle(`Worldle for <t:${params.startedTimeStamp}>`)
        .setDescription(description)
        .addField("\u200b", `\`${NO_OF_GUESSES}\` guesses remaining\nTime runs out <t:${params.timeRemainingTimeStamp}:R>`)
        .setFooter({ text: "Created by Scalz#0001" })
        .setImage(
            `https://raw.githubusercontent.com/mikkel-ol/worldle-discord-bot/293db7a/assets/countries/${params.country.code.toLowerCase()}/1024.png`
        );

    return embed;
};
