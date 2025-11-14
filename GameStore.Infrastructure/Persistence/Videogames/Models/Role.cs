
using System.ComponentModel.DataAnnotations;


namespace GameStore.Infrastructure.Persistence.Videogames;

public partial class Role
{
    [Key]
    public int Id { get; set; }

    [StringLength(50)]
    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;


}
