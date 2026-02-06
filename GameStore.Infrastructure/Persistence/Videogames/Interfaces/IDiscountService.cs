using GameStore.Infrastructure.Persistence.Videogames;

public interface IDiscountService
{
    Task<decimal> ApplyAutomaticDiscountsAsync(
        Videogame videogame,
        decimal originalPrice
    );

    Task<decimal> ApplyCouponAsync(
        Videogame videogame,
        decimal originalPrice,
        string couponCode
    );
}
