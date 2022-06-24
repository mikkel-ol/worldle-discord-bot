import { SlashCommandBuilder } from "@discordjs/builders";
import { CacheType, CommandInteraction, MessageEmbed } from "discord.js";
import { Logger } from "../common/logger";
import { FAILURE_EMOJI, SUCCESS_EMOJI } from "../constants/emojis";
import { Config } from "../models/Config";

export const CONFIG_COMMAND_NAME = "config";

export const configCommand = new SlashCommandBuilder()
    .setName(CONFIG_COMMAND_NAME)
    .setDescription("Configuration for bot")
    .addChannelOption((option) => option.setName("channel").setDescription("Set channel in which game is played"))
    .addIntegerOption((option) => option.setName("interval").setDescription("Interval between new maps are posted (hours)"))
    .addIntegerOption((option) => option.setName("cooldown").setDescription("Cooldown on guesses for users (minutes)"))
    .addBooleanOption((option) => option.setName("enabled").setDescription("Enable/disable the game"));

export const configCommandHandler = async (interaction: CommandInteraction<CacheType>) => {
    // ignore DM's
    if (!interaction.guildId) return;

    const replyEmbed = new MessageEmbed().setTitle(`Configuration for ${interaction.guild?.name}`).setTimestamp(new Date());
    const embedFields = (options: { gameChannelId?: string; interval?: number; cooldown?: number; enabled?: boolean }) =>
        replyEmbed
            .addField("Channel", `${options.gameChannelId ? "<#" + options.gameChannelId + ">" : "Not set"}`)
            .addField("Interval", `${options.interval ?? "Not set"} hours`)
            .addField("Cooldown", `${options.cooldown ?? "Not set"} minutes`)
            .addField("Enabled", `${!!options.enabled ? "Yes" : "No"}`);

    // no arguments - grab config
    if (interaction.options.data.length === 0) {
        const existingConfig = await Config.findOne({ where: { guildId: interaction.guildId ?? "" } });

        if (!existingConfig) return interaction.reply({ content: `${FAILURE_EMOJI} No config found`, ephemeral: true });

        return interaction.reply({
            embeds: [embedFields(existingConfig)],
        });
    }

    if (interaction.options.getChannel("channel")?.type !== "GUILD_TEXT")
        return interaction.reply({ content: `${FAILURE_EMOJI} Channel is not a text channel`, ephemeral: true });

    // upsert new config
    const newGameChannelId = interaction.options.getChannel("channel")?.id;
    const newInterval = interaction.options.getInteger("interval");
    const newCooldown = interaction.options.getInteger("cooldown");
    const newEnabled = interaction.options.getBoolean("enabled");

    const newObj = {
        guildId: interaction.guildId,
        ...(newGameChannelId && { gameChannelId: newGameChannelId }),
        ...(newInterval && { interval: newInterval }),
        ...(newCooldown && { cooldown: newCooldown }),
        ...(newEnabled !== null && { enabled: newEnabled }),
    };

    Config.upsert(newObj)
        .then(([config]) => {
            // returned object does not contain all values for some reason
            // there just return simple msg for now

            Logger.success(`Updated config for guild ${interaction.guildId}`);
            interaction.reply(
                `${SUCCESS_EMOJI} Succesfully updated config`
                //     {
                //     embeds: [embedFields(config).setFooter({ text: `${interaction.user.username} updated config` })],
                // }
            );
        })
        .catch((e) => {
            Logger.error(e);
            interaction.reply({ content: `${FAILURE_EMOJI} Something went wrong`, ephemeral: true });
        });
};
