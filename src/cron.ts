import * as cron from "node-cron";
import { client } from ".";
import { endCurrentGame } from "./games/end";
import { newGame } from "./games/new";
import { Config } from "./models/Config";
import { Game } from "./models/Game";
import { Guess } from "./models/Guess";

const onTick = async () => {
    const guilds = await client.guilds.fetch();
    const allConfigs = await Config.findAll();

    const guildsWithActiveGames = guilds.filter((g) => allConfigs.some((c) => c.guildId === g.id && !!c.enabled));

    guildsWithActiveGames.forEach(async (guild) => {
        const config = allConfigs.find((x) => x.guildId === guild.id);
        const game = await Game.findOne({ where: { guildId: guild.id } });

        if (game) {
            // TODO: CHeck if game is expired

            const guesses = await Guess.findAll({ where: { gameId: game.id } });
            await endCurrentGame(client, game, guesses);
        }

        if (!config?.gameChannelId) throw new Error(`No channel ID found on config ${config}`);

        newGame(client, config);
    });
};

setTimeout(() => onTick(), 2000);

// every minute
cron.schedule("0 * * * * 0", onTick);

export {};
