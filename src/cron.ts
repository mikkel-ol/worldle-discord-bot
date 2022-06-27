import { client } from ".";
import { endCurrentGame } from "./games/end";
import { newGame } from "./games/new";
import { Config } from "./models/Config";

const onTick = async () => {
    const guilds = await client.guilds.fetch();
    const allConfigs = await Config.findAll();

    const guildsWithActiveGames = guilds.filter((g) => allConfigs.some((c) => c.guildId === g.id && !!c.enabled));

    guildsWithActiveGames.forEach(async (guild) => {
        const config = allConfigs.find((x) => x.guildId === guild.id);

        if (!config?.gameChannelId) throw new Error(`No channel ID found on config ${config}`);

        await endCurrentGame(client, config);
        newGame(client, config);
    });
};

setTimeout(() => {
    onTick();
}, 2000);

// every minute
// cron.schedule("0 * * * * *", onTick);

export {};
