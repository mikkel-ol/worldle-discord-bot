import { countries } from "./countries";

export const randCountry = () => {
    // TODO: Make an iPod shuffle algorithm
    const randIndex = Math.floor(Math.random() * countries.length);
    const country = countries[randIndex];

    return country;
};
