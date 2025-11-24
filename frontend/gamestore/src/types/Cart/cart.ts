import type { CartItemCreateDto, CartItemReadDto } from "./cartItem";

export interface CartCreateDto {
  userId: string;
  items: CartItemCreateDto[];
  createdAt: Date;
  updatedAt: Date;
  isCheckedOut: boolean;
}

export interface CartReadDto {
  id: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  isCheckedOut: boolean;
  items: CartItemReadDto[];
}
