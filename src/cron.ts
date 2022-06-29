import * as cron from "node-cron";
import { client } from ".";
import { Logger } from "./common/logger";
import { endCurrentGame } from "./games/end";
import { newGame } from "./games/new";
import { Config } from "./models/Config";
import { Game } from "./models/Game";
import { Guess } from "./models/Guess";
import { generateEpoch } from "./utils/epoch";

const onTick = async () => {
    Logger.info("Running cron job");

    const guilds = await client.guilds.fetch();
    const allConfigs = await Config.findAll();

    const guildsWithEnabled = guilds.filter((g) => allConfigs.some((c) => c.guildId === g.id && !!c.enabled));

    guildsWithEnabled.forEach(async (guild) => {
        const config = allConfigs.find((x) => x.guildId === guild.id);
        const game = await Game.findOne({ where: { guildId: guild.id } });

        if (game && game.expiration < generateEpoch()) {
            const guesses = await Guess.findAll({ where: { gameId: game.id } });
            await endCurrentGame(client, game, guesses);
        }

        if (!config?.gameChannelId) throw new Error(`No channel ID found on config ${config}`);

        newGame(client, config);
    });
};

setTimeout(() => onTick(), 2000);

// every hour
cron.schedule("* 0 * * * *", onTick);

export {};
