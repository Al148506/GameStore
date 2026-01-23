using GameStore.Infrastructure.Persistence.Videogames.Enums;
using GameStore.Infrastructure.Persistence.Videogames.Interfeces;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Interfaces;

public class DiscountService : IDiscountService
{
    private readonly IDiscountRepository _discountRepository;

    public DiscountService(IDiscountRepository discountRepository)
    {
        _discountRepository = discountRepository;
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

        var applicableDiscounts = discounts
            .Where(d => IsApplicable(d, videogame))
            .ToList();

        var finalPrice = CalculateBestDiscount(
            applicableDiscounts,
            originalPrice
        );

        return finalPrice;
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
