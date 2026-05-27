import { Dish } from "./dish";

export interface Menu {
    id?: number;
    year: number;
    week_number: number;
    dishes?: Dish[]; // valfri array av rätter
}
