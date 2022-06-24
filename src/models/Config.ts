import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { db } from "../database";

export class Config extends Model<InferAttributes<Config>, InferCreationAttributes<Config>> {
    declare guildId: string;
    declare gameChannelId?: string;
    declare interval?: number;
    declare cooldown?: number;
    declare enabled?: boolean;
}

Config.init(
    {
        guildId: {
            type: DataTypes.STRING,
            unique: true,
        },
        gameChannelId: {
            type: DataTypes.STRING,
            unique: true,
        },
        interval: {
            type: DataTypes.INTEGER,
            defaultValue: process.env.DEFAULT_INTERVAL_HOURS,
        },
        cooldown: {
            type: DataTypes.INTEGER,
            defaultValue: process.env.DEFAULT_COOLDOWN_MINUTES,
        },
        enabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    { tableName: "config", sequelize: db }
);
