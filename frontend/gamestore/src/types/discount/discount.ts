export type DiscountTargetType = "All" | "Videogame" | "Genre" | "Platform";
export type DiscountType = "Seasonal" | "Coupon";
export type DiscountValueType = "Percentage" | "Fixed";

export interface DiscountScopeDto {
  targetType: DiscountTargetType;
  targetId?: number;
}

export interface CreateCouponDto {
  code: string;
  maxUses?: number;
}

export interface CreateDiscountRequest {
  name: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  scopes: DiscountScopeDto[];
  coupon?: CreateCouponDto;
}

export interface DiscountListItem {
  id: string;
  name: string;
  type: string;
  valueType: string;
  value: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
}

export interface UpdateDiscountScopeRequest {
  id?: string;
  targetType: string;
  targetId: string;
}

export interface UpdateCouponRequest {
  id?: string;
  code: string;
  maxUses?: number;
}

export interface UpdateDiscountRequest {
  name: string;
  type: string;
  valueType: string;
  value: number;
  startDate: string;
  endDate?: string;
  isActive: boolean;
  scopes: UpdateDiscountScopeRequest[];
  coupon?: UpdateCouponRequest;
}

export interface DiscountDetailDto {
  id: string;
  name: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  discountScopes: DiscountScopeDto[];
  coupon?: CreateCouponDto;
}

