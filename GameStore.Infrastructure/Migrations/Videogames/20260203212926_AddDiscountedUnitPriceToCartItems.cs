using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameStore.Infrastructure.Migrations.Videogames
{
    /// <inheritdoc />
    public partial class AddDiscountedUnitPriceToCartItems : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Total",
                table: "CartItems",
                newName: "DiscountedUnitPrice");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "DiscountedUnitPrice",
                table: "CartItems",
                newName: "Total");
        }
    }
}
