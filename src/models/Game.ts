import { Association, DataTypes, InferAttributes, InferCreationAttributes, Model, NonAttribute } from "sequelize";
import { db } from "../database";
import { Guess } from "./Guess";

export class Game extends Model<InferAttributes<Game>, InferCreationAttributes<Game>> {
    declare guildId: string;
    declare active: boolean;
    declare countryId: string;
    declare guesses?: NonAttribute<Guess[]>;

    declare static associations: {
        guesses: Association<Game, Guess>;
    };
}

Game.init(
    {
        guildId: DataTypes.STRING,
        active: DataTypes.BOOLEAN,
        countryId: DataTypes.STRING,
    },
    { tableName: "game", sequelize: db }
);
