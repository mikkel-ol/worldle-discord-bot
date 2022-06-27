import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { db } from "../database";
import { GameState } from "../types/GameState";
import { Guess } from "./Guess";

export class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    declare id: NonAttribute<number>;
    declare guildId: string;
    declare state: GameState;
    declare countryId: string;
    declare started: number;
    declare expiration: number;

    declare static associations: {
        guesses: Association<Game, Guess>;
    };
}

Game.init(
    {
        guildId: DataTypes.STRING,
        state: DataTypes.STRING,
        countryId: DataTypes.STRING,
        started: DataTypes.INTEGER,
        expiration: DataTypes.INTEGER,
    },
    { tableName: "game", sequelize: db }
);
