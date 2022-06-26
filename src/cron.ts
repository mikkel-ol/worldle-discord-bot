import cron from "node-cron";
import { client } from ".";
import { generateNewEmbed } from "./embeds/generate";
import { Config } from "./models/Config";

const onTick = async () => {
    const guilds = await client.guilds.fetch();
    const allConfigs = await Config.findAll();

    const guildsWithConfig = guilds.filter((g) => allConfigs.some((c) => c.guildId === g.id));

    guildsWithConfig.forEach((guild) => {
        const config = allConfigs.find((x) => x.guildId === guild.id);

        if (!config?.gameChannelId) throw new Error(`No channel ID found on config ${config}`);

        generateNewEmbed(client, guild, config);
    });
};

setTimeout(() => {
    onTick();
}, 1000);

// every minute
cron.schedule("0 * * * * *", onTick);

export {};
