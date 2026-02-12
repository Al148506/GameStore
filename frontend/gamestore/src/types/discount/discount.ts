// ==============================
// Enums / Union Types
// ==============================
export type DiscountTargetType = "All" | "Videogame" | "Genre" | "Platform";
export type DiscountType = "Seasonal" | "Coupon";
export type DiscountValueType = "Percentage" | "Fixed";

// ==============================
// Scopes
// ==============================
export interface DiscountScopeBase {
  targetType: DiscountTargetType;
  targetId?: number;
}

export type CreateDiscountScopeRequest = DiscountScopeBase;

export type UpdateDiscountScopeRequest = DiscountScopeBase & {
  id?: string;
};

// ==============================
// Coupon
// ==============================
export interface CouponBase {
  code: string;
  maxUses?: number;
}

export type CreateCouponRequest = CouponBase;

export type UpdateCouponRequest = CouponBase & {
  id?: string;
};

// ==============================
// Discount Requests
// ==============================
export interface CreateDiscountRequest {
  name: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  startDate: string | null;
  endDate: string | null;
  isActive: boolean;
  discountScopes: CreateDiscountScopeRequest[];
  coupon?: CreateCouponRequest;
}

export interface UpdateDiscountRequest extends CreateDiscountRequest {
  discountScopes: UpdateDiscountScopeRequest[];
  coupon?: UpdateCouponRequest;
}

// ==============================
// List / Detail DTOs
// ==============================
export interface DiscountListItem {
  id: string;
  name: string;
  type: DiscountType;
  valueType: DiscountValueType;
  value: number;
  isActive: boolean;
  startDate: string;
  endDate: string;
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
  discountScopes: UpdateDiscountScopeRequest[];
  coupon?: UpdateCouponRequest;
}
