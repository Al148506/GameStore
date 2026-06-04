export interface CartItemCreateDto {
  videogameId: number;
  quantity: number;
}

export interface CartItemUpdateDto {
  quantity: number;
}

export interface CartItemReadDto {
  id: number;
  videogameId: number;
  videogameName: string;
  quantity: number;
  unitPrice: number;
  discountedUnitPrice: number;
  total: number;
}
