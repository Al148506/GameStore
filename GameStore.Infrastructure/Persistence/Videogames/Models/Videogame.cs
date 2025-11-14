using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Persistence.Videogames;

public partial class Videogame
{
    [Key]
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime ReleaseDate { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    public int Stock { get; set; }

    public string ImageUrl { get; set; } = null!;

    public string Rating { get; set; } = null!;

    [ForeignKey("VideogamesId")]
    [InverseProperty("Videogames")]
    public virtual ICollection<Genre> Genres { get; set; } = new List<Genre>();

    [ForeignKey("VideogamesId")]
    [InverseProperty("Videogames")]
    public virtual ICollection<Platform> Platforms { get; set; } = new List<Platform>();
}
