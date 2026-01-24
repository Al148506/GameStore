using GameStore.Infrastructure.Persistence.Videogames.Enums;
using GameStore.Infrastructure.Persistence.Videogames.Interfeces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Services;

public class DiscountService : IDiscountService
{
    private readonly IDiscountRepository _discountRepository;
    private readonly ICouponValidator _couponValidator;


    public DiscountService(IDiscountRepository discountRepository, ICouponValidator couponValidator)
    {
        _discountRepository = discountRepository;
        _couponValidator = couponValidator;
    }

    public DiscountService()
    {
    }

    public async Task<decimal> ApplyDiscountAsync(
    Videogame videogame,
    decimal originalPrice,
    string? couponCode)
    {
        var discounts = await _discountRepository.GetActiveDiscountsAsync();

        //  Validar cupón (si existe)
        if (!string.IsNullOrWhiteSpace(couponCode))
        {
            var couponDiscount = await _couponValidator.ValidateAsync(couponCode);

            if (couponDiscount != null &&
                IsApplicable(couponDiscount, videogame))
            {
                var finalPrice = CalculateBestDiscount(
                    new List<Discount> { couponDiscount },
                    originalPrice
                );

                await _couponValidator.RegisterUsageAsync(
                    couponDiscount.Coupon!.Id
                );

                return finalPrice;
            }
        }

        var applicableDiscounts = discounts
            .Where(d => IsApplicable(d, videogame))
            .ToList();

        return CalculateBestDiscount(applicableDiscounts, originalPrice);
    }


    private bool IsApplicable(Discount discount, Videogame videogame)
    {
        foreach (var scope in discount.DiscountScopes)
        {
            switch (scope.TargetType)
            {
                case DiscountTargetType.All:
                    return true;

                case DiscountTargetType.Videogame:
                    if (scope.TargetId == videogame.Id)
                        return true;
                    break;

                case DiscountTargetType.Genre:
                    if (scope.TargetId.HasValue && videogame.Genres.Any(g => scope.TargetId.Value == (g.Id)))
                        return true;
                    break;

                case DiscountTargetType.Platform:
                    if (scope.TargetId.HasValue && videogame.Platforms.Any(p => scope.TargetId.Value == p.Id))
                        return true;
                    break;
            }
        }

        return false;
    }

    private decimal CalculateBestDiscount(
        List<Discount> discounts,
        decimal originalPrice)
    {
        decimal bestPrice = originalPrice;

        foreach (var discount in discounts)
        {
            decimal discountedPrice = originalPrice;

            if (discount.ValueType == DiscountValueType.Percentage)
            {
                discountedPrice -= originalPrice * (discount.Value / 100m);
            }
            else if (discount.ValueType == DiscountValueType.Fixed)
            {
                discountedPrice -= discount.Value;
            }

            if (discountedPrice < 0)
                discountedPrice = 0;

            if (discountedPrice < bestPrice)
                bestPrice = discountedPrice;
        }

        return bestPrice;
    }
}
