export type Direction = "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";

export const directionMap = new Map<Direction, string>([
    ["N", ":arrow_up:"],
    ["NE", ":arrow_upper_right:"],
    ["E", ":arrow_right:"],
    ["SE", ":arrow_lower_right:"],
    ["S", ":arrow_down:"],
    ["SW", ":arrow_lower_left:"],
    ["W", ":arrow_left:"],
    ["NW", ":arrow_upper_left:"],
]);
