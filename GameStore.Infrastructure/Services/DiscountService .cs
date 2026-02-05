using GameStore.Infrastructure.Persistence.Videogames.Enums;
using GameStore.Infrastructure.Persistence.Videogames.Interfaces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Persistence.Videogames;

public class DiscountService : IDiscountService
{
    private readonly IDiscountRepository _discountRepository;
    private readonly ICouponValidator _couponValidator;

    public DiscountService(
        IDiscountRepository discountRepository,
        ICouponValidator couponValidator)
    {
        _discountRepository = discountRepository;
        _couponValidator = couponValidator;
    }

    // =========================
    // AUTOMATIC DISCOUNTS
    // =========================
    public async Task<decimal> ApplyAutomaticDiscountsAsync(
        Videogame videogame,
        decimal originalPrice)
    {
        var discounts = await _discountRepository.GetActiveDiscountsAsync();

        var applicableDiscounts = discounts
            .Where(d => IsApplicable(d, videogame))
            .ToList();

        return CalculateBestDiscount(applicableDiscounts, originalPrice);
    }

    // =========================
    // COUPON DISCOUNT
    // =========================
    public async Task<decimal> ApplyCouponAsync(
        Videogame videogame,
        decimal originalPrice,
        string couponCode)
    {
        var couponDiscount = await _couponValidator.ValidateAsync(couponCode);

        if (couponDiscount == null)
            throw new InvalidOperationException("Cupón inválido o expirado");

        if (!IsApplicable(couponDiscount, videogame))
            throw new InvalidOperationException("El cupón no aplica a este producto");

        await _couponValidator.RegisterUsageAsync(
            couponDiscount.Coupon!.Id
        );

        return CalculateBestDiscount(
            new List<Discount> { couponDiscount },
            originalPrice
        );
    }

    // =========================
    // SHARED LOGIC
    // =========================
    private bool IsApplicable(Discount discount, Videogame videogame)
    {
        return discount.DiscountScopes.Any(scope =>
            scope.TargetType switch
            {
                DiscountTargetType.All => true,

                DiscountTargetType.Videogame =>
                    scope.TargetId == videogame.Id,

                DiscountTargetType.Genre =>
                    scope.TargetId.HasValue &&
                    videogame.Genres.Any(g => g.Id == scope.TargetId),

                DiscountTargetType.Platform =>
                    scope.TargetId.HasValue &&
                    videogame.Platforms.Any(p => p.Id == scope.TargetId),

                _ => false
            });
    }

    private decimal CalculateBestDiscount(
        List<Discount> discounts,
        decimal originalPrice)
    {
        decimal bestPrice = originalPrice;

        foreach (var discount in discounts)
        {
            decimal discountedPrice = discount.ValueType switch
            {
                DiscountValueType.Percentage =>
                    originalPrice - (originalPrice * discount.Value / 100m),

                DiscountValueType.Fixed =>
                    originalPrice - discount.Value,

                _ => originalPrice
            };

            if (discountedPrice < 0)
                discountedPrice = 0;

            if (discountedPrice < bestPrice)
                bestPrice = discountedPrice;
        }

        return bestPrice;
    }
}
