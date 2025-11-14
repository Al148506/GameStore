using AutoMapper;
using GameStore.Api.DTOs.Order;
using GameStore.Infrastructure.Persistence.Videogames.Models;

namespace GameStore.Api.AutoMapper
{
    public class OrdersProfile : Profile
    {
        public OrdersProfile()
        {
            CreateMap<Order, OrderDto>();
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(dest => dest.VideogameName, opt => opt.MapFrom(src => src.Videogame != null ? src.Videogame.Name : null));
        }
    }

}
