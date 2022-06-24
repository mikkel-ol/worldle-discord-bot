import { DataTypes, Sequelize } from "sequelize";

export const Config = (db: Sequelize) =>
    db.define("config", {
        id: {
            type: DataTypes.INTEGER,
            unique: true,
            primaryKey: true,
        },
        guildId: {
            type: DataTypes.STRING,
            unique: true,
        },
        gameChannelId: {
            type: DataTypes.STRING,
            unique: true,
        },
        interval: DataTypes.INTEGER,
        cooldown: DataTypes.INTEGER,
        enabled: DataTypes.BOOLEAN,
    });
