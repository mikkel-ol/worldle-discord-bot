import { client } from ".";
import { newGame } from "./games/generate";
import { stopCurrentGame } from "./games/stop";
import { Config } from "./models/Config";

const onTick = async () => {
    const guilds = await client.guilds.fetch();
    const allConfigs = await Config.findAll();

    const guildsWithActiveGames = guilds.filter((g) => allConfigs.some((c) => c.guildId === g.id && !!c.enabled));

    guildsWithActiveGames.forEach(async (guild) => {
        const config = allConfigs.find((x) => x.guildId === guild.id);

        if (!config?.gameChannelId) throw new Error(`No channel ID found on config ${config}`);

        await stopCurrentGame(client, config);
        newGame(client, config);
    });
};

setTimeout(() => {
    onTick();
}, 1000);

// every minute
// cron.schedule("0 * * * * *", onTick);

export {};
