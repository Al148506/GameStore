using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs.Videogames
{
    public class PlataformDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;
    }
}
