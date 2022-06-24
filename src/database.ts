import { Sequelize } from "sequelize";

export const db = new Sequelize("worldle", "user", "password", {
    host: "localhost",
    dialect: "sqlite",
    logging: false,
    storage: process.env.SQLITE_PATH ?? "database.sqlite",
});
