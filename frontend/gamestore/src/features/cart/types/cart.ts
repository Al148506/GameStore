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
  createdAt: string; // ⚠ mejor string, te explico abajo
  updatedAt: string;
  isCheckedOut: boolean;

  subtotal: number;
  discountAmount: number;
  total: number;
  appliedCouponCode: string | null;

  items: CartItemReadDto[];
}
