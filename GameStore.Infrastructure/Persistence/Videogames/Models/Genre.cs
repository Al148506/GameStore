using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Persistence.Videogames;

public partial class Genre
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    [ForeignKey("GenresId")]
    [InverseProperty("Genres")]
    public virtual ICollection<Videogame> Videogames { get; set; } = new List<Videogame>();
}
