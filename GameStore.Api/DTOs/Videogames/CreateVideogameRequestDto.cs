using System.ComponentModel.DataAnnotations;

namespace GameStore.Api.DTOs.Videogames
{
    public sealed class CreateVideogameRequestDto
    {

        [Required]
        [StringLength(200)]
        public string Name { get; set; } = null!;

        [Required]
        [StringLength(2000)]
        public string Description { get; set; } = null!;

        [DataType(DataType.Date)]
        public DateTime ReleaseDate { get; set; }

        // decimal(18,2) – validar rango con decimal explícito
        [Range(typeof(decimal), "0", "9999999999999999.99")]
        public decimal Price { get; set; }

        [Range(0, int.MaxValue)]
        public int Stock { get; set; }

        [Required]
        [Url]
        [StringLength(500)]
        public string ImageUrl { get; set; } = null!;

        [Required]
        [StringLength(10)]
        public string Rating { get; set; } = null!;

        // Relaciones many-to-many como listas de IDs
        public List<int>? GenreIds { get; set; }

        public List<int>? PlatformIds { get; set; }
    }
}
