export interface CartItemCreateDto {
    VideogameId: number;
    Quantity: number;
    UnitPrice: number;
}

export interface CartItemUpdateDto {
    Quantity: number;
}

export interface CartItemReadDto{
    Id: number;
    VideogameId:number;
    VideogameName: string;
    Quantity: number;
    UnitPrice: number;
    Total:number;
}

