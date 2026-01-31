using AutoMapper;
using GameStore.Api.DTOs.Discounts;
using GameStore.Infrastructure.Persistence.Videogames.Models;
using GameStore.Infrastructure.Commands.Discounts;
namespace GameStore.Api.AutoMapper
{
    public class DiscountsProfile : Profile
    {
        public DiscountsProfile()
        {
            // Para lista (información resumida)
            CreateMap<Discount, DiscountListItemDto>()
                .ForMember(dest => dest.CouponCode,
                    opt => opt.MapFrom(src => src.Coupon != null ? src.Coupon.Code : null))
                .ForMember(dest => dest.ScopesCount,
                    opt => opt.MapFrom(src => src.DiscountScopes != null ? src.DiscountScopes.Count : 0));

            // Para detalle (información completa)
            CreateMap<Discount, DiscountDetailDto>();

            // Propiedades anidadas
            CreateMap<Coupon, CouponDto>();
            CreateMap<DiscountScope, DiscountScopeDto>();

            // Commands
            CreateMap<UpdateDiscountRequest, UpdateDiscountCommand>();
            CreateMap<DiscountScopeDto, UpdateDiscountScopeCommand>();
            CreateMap<CouponDto, UpdateCouponCommand>();
        }
    }
}