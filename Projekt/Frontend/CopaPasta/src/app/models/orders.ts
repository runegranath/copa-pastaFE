export interface Orders {
    id?: number;               
    dish_id: number;           
    customer_name: string;
    customer_phone: string;
    pickup_time: string;       
    order_status?: string;     
    quantity: number;
}
