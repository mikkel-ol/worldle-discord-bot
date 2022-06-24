import { SlashCommandBuilder } from "@discordjs/builders";

export const configCommand = new SlashCommandBuilder()
    .setName("config")
    .setDescription("Configuration for bot")
    .addChannelOption((option) => option.setName("channel").setDescription("Set channel in which game is played"))
    .addIntegerOption((option) => option.setName("interval").setDescription("Interval between new maps are posted (hours)"))
    .addIntegerOption((option) => option.setName("cooldown").setDescription("Cooldown on guesses for users (minutes)"))
    .addBooleanOption((option) => option.setName("enabled").setDescription("Enable/disable the game"));
