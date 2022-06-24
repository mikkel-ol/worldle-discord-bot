import { SlashCommandBuilder } from "@discordjs/builders";
import { Interaction } from "discord.js";

export const CONFIG_COMMAND_NAME = "config";

export const configCommand = new SlashCommandBuilder()
    .setName(CONFIG_COMMAND_NAME)
    .setDescription("Configuration for bot")
    .addChannelOption((option) => option.setName("channel").setDescription("Set channel in which game is played"))
    .addIntegerOption((option) => option.setName("interval").setDescription("Interval between new maps are posted (hours)"))
    .addIntegerOption((option) => option.setName("cooldown").setDescription("Cooldown on guesses for users (minutes)"))
    .addBooleanOption((option) => option.setName("enabled").setDescription("Enable/disable the game"));

export const configCommandHandler = async (interaction: Interaction) => {
    //
};
