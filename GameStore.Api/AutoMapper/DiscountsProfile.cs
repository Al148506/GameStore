using AutoMapper;
using GameStore.Api.DTOs.Discounts;
using GameStore.Infrastructure.Persistence.Videogames.Models;

namespace GameStore.Api.AutoMapper
{
    public class DiscountsProfile : Profile
    {
        public DiscountsProfile()
        {
            CreateMap<Discount, DiscountListItemDto>();
            CreateMap<DiscountListItemDto, Discount>();
        }
    }
}