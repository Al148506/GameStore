
using GameStore.Infrastructure.Persistence.Videogames.Models;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Persistence.Videogames;

public partial class VideogamesDbContext : DbContext
{
    public VideogamesDbContext(DbContextOptions<VideogamesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<Platform> Platforms { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Sale> Sales { get; set; }

    public virtual DbSet<SaleDetail> SaleDetails { get; set; }

    public virtual DbSet<Videogame> Videogames { get; set; }

    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Genre>(entity =>
        {
            entity.HasMany(d => d.Videogames).WithMany(p => p.Genres)
                .UsingEntity<Dictionary<string, object>>(
                    "VideogameGenre",
                    r => r.HasOne<Videogame>().WithMany().HasForeignKey("VideogamesId"),
                    l => l.HasOne<Genre>().WithMany().HasForeignKey("GenresId"),
                    j =>
                    {
                        j.HasKey("GenresId", "VideogamesId");
                        j.ToTable("VideogameGenres");
                        j.HasIndex(new[] { "VideogamesId" }, "IX_VideogameGenres_VideogamesId");
                    });
        });

        modelBuilder.Entity<Platform>(entity =>
        {
            entity.HasMany(d => d.Videogames).WithMany(p => p.Platforms)
                .UsingEntity<Dictionary<string, object>>(
                    "VideogamePlatform",
                    r => r.HasOne<Videogame>().WithMany().HasForeignKey("VideogamesId"),
                    l => l.HasOne<Platform>().WithMany().HasForeignKey("PlatformsId"),
                    j =>
                    {
                        j.HasKey("PlatformsId", "VideogamesId");
                        j.ToTable("VideogamePlatforms");
                        j.HasIndex(new[] { "VideogamesId" }, "IX_VideogamePlatforms_VideogamesId");
                    });
        });

        modelBuilder.Entity<Cart>()
        .HasMany(c => c.Items)
        .WithOne(i => i.Cart)
        .HasForeignKey(i => i.CartId)
        .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<CartItem>()
            .HasOne(i => i.Videogame)
            .WithMany() // Un videojuego puede estar en muchos carritos
            .HasForeignKey(i => i.VideogameId)
            .OnDelete(DeleteBehavior.Restrict);


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
