import type { OrderItemDto } from "./orderItem";

export type OrderStatus =
  | "Pending"
  | "Paid"
  | "Shipped"
  | "Cancelled"
  | "Refunded";

export interface OrderDto {
  id: number;
  createdAt: Date;
  totalAmount: number;
  status: OrderStatus;
  items: OrderItemDto[];
}
