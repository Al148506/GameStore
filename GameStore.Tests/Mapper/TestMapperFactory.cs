using AutoMapper;
using GameStore.Api.DTOs.Videogames;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace GameStore.Tests.Mapper
{
    public class TestMapperFactory
    {
        public static IMapper CreateMapper()
        {
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddMaps(typeof(VideogameDTO));
            });

            return config.CreateMapper();
        }
    }
}
