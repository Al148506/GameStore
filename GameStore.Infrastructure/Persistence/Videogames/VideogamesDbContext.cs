
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

    public virtual DbSet<Videogame> Videogames { get; set; }

    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<Discount> Discounts { get; set; }
    public DbSet<Coupon> Coupons { get; set; }
    public DbSet<DiscountScope> DiscountScopes { get; set; }



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

        modelBuilder.Entity<Order>(entity =>
        {
            entity.Property(o => o.TotalAmount)
                  .HasColumnType("decimal(18,2)");

            entity.Property(o => o.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()");

            entity.HasIndex(o => o.UserId);
            entity.HasIndex(o => o.CreatedAt);

            entity.HasMany(o => o.Items)
                  .WithOne(i => i.Order)
                  .HasForeignKey(i => i.OrderId)
                  .OnDelete(DeleteBehavior.Cascade); // elimina items al borrar order
        });

        modelBuilder.Entity<Discount>()
              .HasMany(d => d.DiscountScopes)
              .WithOne(s => s.Discount)
              .HasForeignKey(s => s.DiscountId)
              .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<Discount>()
            .HasOne(d => d.Coupon)
            .WithOne(c => c.Discount)
            .HasForeignKey<Coupon>(c => c.DiscountId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Discount>()
        .HasIndex(d => new { d.StartDate, d.EndDate })
        .HasDatabaseName("IX_Discounts_StartDate_EndDate");


        modelBuilder.Entity<Coupon>()
            .HasIndex(c => c.Code)
            .IsUnique();


        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
