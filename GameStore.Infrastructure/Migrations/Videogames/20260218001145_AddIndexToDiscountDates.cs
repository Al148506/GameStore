using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameStore.Infrastructure.Migrations.Videogames
{
    /// <inheritdoc />
    public partial class AddIndexToDiscountDates : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Discounts_StartDate_EndDate",
                table: "Discounts",
                columns: new[] { "StartDate", "EndDate" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Discounts_StartDate_EndDate",
                table: "Discounts");
        }
    }
}
