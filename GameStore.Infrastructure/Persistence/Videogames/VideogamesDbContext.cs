using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Persistence.Videogames;

public partial class VideogamesDbContext : DbContext
{
    public VideogamesDbContext(DbContextOptions<VideogamesDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<AspNetRole> AspNetRoles { get; set; }

    public virtual DbSet<AspNetRoleClaim> AspNetRoleClaims { get; set; }

    public virtual DbSet<AspNetUser> AspNetUsers { get; set; }

    public virtual DbSet<AspNetUserClaim> AspNetUserClaims { get; set; }

    public virtual DbSet<AspNetUserLogin> AspNetUserLogins { get; set; }

    public virtual DbSet<AspNetUserToken> AspNetUserTokens { get; set; }

    public virtual DbSet<Genre> Genres { get; set; }

    public virtual DbSet<Platform> Platforms { get; set; }

    public virtual DbSet<Role> Roles { get; set; }

    public virtual DbSet<Sale> Sales { get; set; }

    public virtual DbSet<SaleDetail> SaleDetails { get; set; }

    public virtual DbSet<Videogame> Videogames { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<AspNetRole>(entity =>
        {
            entity.HasIndex(e => e.NormalizedName, "RoleNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedName] IS NOT NULL)");
        });

        modelBuilder.Entity<AspNetUser>(entity =>
        {
            entity.HasIndex(e => e.NormalizedUserName, "UserNameIndex")
                .IsUnique()
                .HasFilter("([NormalizedUserName] IS NOT NULL)");

            entity.Property(e => e.Name).HasDefaultValue("");

            entity.HasMany(d => d.Roles).WithMany(p => p.Users)
                .UsingEntity<Dictionary<string, object>>(
                    "AspNetUserRole",
                    r => r.HasOne<AspNetRole>().WithMany().HasForeignKey("RoleId"),
                    l => l.HasOne<AspNetUser>().WithMany().HasForeignKey("UserId"),
                    j =>
                    {
                        j.HasKey("UserId", "RoleId");
                        j.ToTable("AspNetUserRoles");
                        j.HasIndex(new[] { "RoleId" }, "IX_AspNetUserRoles_RoleId");
                    });
        });

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

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
