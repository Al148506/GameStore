using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Persistence.Videogames;

[Index("SaleId", Name = "IX_SaleDetails_SaleId")]
[Index("VideogameId", Name = "IX_SaleDetails_VideogameId")]
public partial class SaleDetail
{
    [Key]
    public int Id { get; set; }

    public int SaleId { get; set; }

    public int VideogameId { get; set; }

    public int Quantity { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    [ForeignKey("SaleId")]
    [InverseProperty("SaleDetails")]
    public virtual Sale Sale { get; set; } = null!;

    [ForeignKey("VideogameId")]
    [InverseProperty("SaleDetails")]
    public virtual Videogame Videogame { get; set; } = null!;
}
