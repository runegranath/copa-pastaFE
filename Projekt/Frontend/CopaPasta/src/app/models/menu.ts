import { Dish } from "./dish";

export interface Menu {
    id?: number;
    year: number;
    week_number: number;
    is_published: number; // istället för boolean blir det 0 eller 1
    dishes?: Dish[]; // valfri array av rätter
}
