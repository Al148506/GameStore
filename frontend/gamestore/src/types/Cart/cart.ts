import type { CartItemCreateDto, CartItemReadDto } from "./cartItem";

export interface CartCreateDto {
  UserId: string;
  Items: CartItemCreateDto[];
  CreatedAt: Date;
  UpdatedAt: Date;
  IsCheckedOut: boolean;
}

export interface CartReadDto {
  Id: number;
  UserId: string;
  CreatedAt: Date;
  UpdatedAt: Date;
  IsCheckedOut: boolean;
  Items: CartItemReadDto[];

}