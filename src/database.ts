import { Sequelize } from "sequelize";
import { Config } from "./models/Config";

export const db = new Sequelize("worldle", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: process.env.SQLITE_PATH ?? "database.sqlite",
});

export const initDatabase = () => {
    Config(db);

    return db.sync();
};
