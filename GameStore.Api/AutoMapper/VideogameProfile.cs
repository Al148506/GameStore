using Microsoft.AspNetCore.Mvc;
using AutoMapper;
using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Api.DTOs.Videogames;

namespace GameStore.Api.AutoMapper
{
    public class VideogameProfile : Profile
    {
        public VideogameProfile()
        {
            CreateMap<Videogame, VideogameDTO>()
                .ForMember(dest => dest.Genres, opt => opt.MapFrom(src =>
                    src.Genres.Select(g => g.Name).OrderBy(n => n)))
                .ForMember(dest => dest.Platforms, opt => opt.MapFrom(src =>
                    src.Platforms.Select(p => p.Name).OrderBy(n => n)));

            CreateMap<UpdateVideogameRequestDto, Videogame>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Genres, opt => opt.Ignore())
            .ForMember(dest => dest.Platforms, opt => opt.Ignore());
        }
    }
}
