import { DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { db } from "../database";

export class Guess extends Model<InferAttributes<Guess>, InferCreationAttributes<Guess>> {
    declare gameId: number;
    declare userId: string;
    declare countryId: string;
    declare distance: number;
    declare direction: string;
    declare percentage: number;
}

Guess.init(
    {
        gameId: DataTypes.INTEGER,
        userId: DataTypes.STRING,
        countryId: DataTypes.STRING,
        distance: DataTypes.INTEGER,
        direction: DataTypes.STRING,
        percentage: DataTypes.INTEGER,
    },
    { tableName: "guess", sequelize: db }
);
