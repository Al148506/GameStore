using AutoMapper;
using GameStore.Api.AutoMapper;

namespace GameStore.Tests.Mapper
{
    public static class TestMapperFactory
    {
        public static IMapper CreateMapper()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<VideogameProfile>();
                cfg.AddProfile<CartProfile>();
                cfg.AddProfile<OrdersProfile>();
            });

            return config.CreateMapper();
        }
    }
}
