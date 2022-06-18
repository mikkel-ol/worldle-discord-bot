import { countries } from "../domain/countries";

export const countryOptions = countries.map((country) => [country.name, country.code] as [name: string, value: string]).slice(0, 25);
