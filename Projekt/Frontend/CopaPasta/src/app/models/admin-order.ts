export interface AdminOrder {
    id: number;
  dish_id: number;
  customer_name: string;
  customer_phone: string;
  pickup_time: string;
  order_status: 'pending' | 'ready';
  quantity: number;
  title: string;       // Title och day_of_week från join med dishes
  day_of_week: string;  
}
