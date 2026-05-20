export interface User {
    id?: number; // gör det valfritt eftersom det kommer att skapas av backend
    email: string;
    password: string;
    created: Date;
}
