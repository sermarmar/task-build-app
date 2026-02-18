// Importing JSON requires compiler support (resolveJsonModule)
import statesData from "./states.json";
import categoriesData from "./categories.json";

export interface Option {
    key: string;
    value: string;
}

// typed constant derived from the JSON data
export const states: Option[] = statesData;
export const categories: Option[] = categoriesData;