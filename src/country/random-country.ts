import { countriesArray } from "./countries";

export const randCountry = () => {
    // TODO: Make an iPod shuffle algorithm
    const randIndex = Math.floor(Math.random() * countriesArray.length);
    const country = countriesArray[randIndex];

    return country;
};
