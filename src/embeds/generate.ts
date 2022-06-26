import { Client, MessageEmbed, OAuth2Guild, TextChannel } from "discord.js";
import { Logger } from "../common/logger";
import { WHITE_SQUARE_EMOJI_ID } from "../constants/emojis";
import { NO_OF_GUESSES } from "../constants/guess";
import { NO_OF_WHITE_SQUARES } from "../constants/messages";
import { randCountry } from "../country/random-country";
import { Config } from "../models/Config";
import { generateEpoch } from "../utils/epoch";

export const generateNewEmbed = async (client: Client, guild: OAuth2Guild, config: Config) => {
    if (!config?.gameChannelId) return Logger.error(`No channel ID found on config ${config}`);

    const channel = (await client.channels.fetch(config.gameChannelId)) as TextChannel;

    if (!channel) return Logger.error(`Could not fetch channel with ID ${config.gameChannelId}, got ${channel}`);

    const newCountry = randCountry();

    const whiteSquareEmoji = client.emojis.cache.get(WHITE_SQUARE_EMOJI_ID);
    const whiteSquareEmojiString = Array(NO_OF_WHITE_SQUARES).fill(whiteSquareEmoji).join("");
    const description = Array(NO_OF_GUESSES)
        .fill(whiteSquareEmojiString)
        .map((x, i) => `\`${i + 1}.\`${x}`)
        .join("\n");

    const embed = new MessageEmbed()
        .setTitle(`Worldle for <t:${generateEpoch()}>`)
        .setDescription(description)
        .addField("\u200b", `\`${NO_OF_GUESSES}\` guesses remaining\nTime runs out <t:${generateEpoch()}:R>`)
        .setFooter({ text: "Created by Scalz#0001" })
        .setImage(
            `https://raw.githubusercontent.com/mikkel-ol/worldle-discord-bot/293db7a/assets/countries/${newCountry.code.toLowerCase()}/1024.png`
        );

    channel.send({ embeds: [embed] });
};
