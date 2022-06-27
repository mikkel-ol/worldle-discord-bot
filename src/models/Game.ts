import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { NO_OF_GUESSES } from "../constants/game";
import { db } from "../database";
import { GameState } from "../types/GameState";
import { Guess } from "./Guess";

export class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    declare id: NonAttribute<number>;
    declare guildId: string;
    declare isActive: boolean;
    declare isSolved: boolean;
    declare countryId: string;
    declare started: number;
    declare expiration: number;
    declare guesses?: NonAttribute<Guess[]>;

    declare static associations: {
        guesses: Association<Game, Guess>;
    };

    get state(): NonAttribute<GameState> {
        return this.isActive
            ? GameState.Active
            : this.isSolved
            ? GameState.Solved
            : this.guesses?.length === NO_OF_GUESSES
            ? GameState.Failed
            : GameState.TimeIsUp;
    }
}

Game.init(
    {
        guildId: DataTypes.STRING,
        isActive: DataTypes.BOOLEAN,
        isSolved: DataTypes.BOOLEAN,
        countryId: DataTypes.STRING,
        started: DataTypes.INTEGER,
        expiration: DataTypes.INTEGER,
    },
    { tableName: "game", sequelize: db }
);
