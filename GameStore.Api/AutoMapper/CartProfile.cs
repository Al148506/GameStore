using AutoMapper;
using GameStore.Api.Dtos.Cart;
using GameStore.Api.DTOs.Cart;
using GameStore.Api.DTOs.Videogames;
using GameStore.Infrastructure.Persistence.Videogames.Models;

namespace GameStore.Api.AutoMapper
{
    public class CartProfile : Profile
    {
        public CartProfile()
        {
            // Cart <-> DTOs
            CreateMap<Cart, CartReadDto>();
            CreateMap<CartCreateDto, Cart>()
                .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items));

            CreateMap<CartItemCreateDto, CartItem>()
                 .ForMember(dest => dest.UnitPrice, opt => opt.MapFrom(src => src.VideogameId));;

            // CartItem <-> DTOs
            CreateMap<CartItem, CartItemReadDto>()
                .ForMember(dest => dest.VideogameName, opt => opt.MapFrom(src => src.Videogame.Name));

            CreateMap<CartItemReadDto, CartItem>()
                .ForMember(dest => dest.Total, opt => opt.MapFrom(src => src.Quantity * src.UnitPrice));
        }
    }
}
