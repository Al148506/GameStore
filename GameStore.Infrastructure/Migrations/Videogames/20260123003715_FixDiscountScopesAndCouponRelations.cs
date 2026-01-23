using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GameStore.Infrastructure.Migrations.Videogames
{
    public partial class FixDiscountScopesAndCouponRelations : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            /* ============================
             * 1️⃣ DiscountScopes.TargetId
             * Guid?  → int? (safe way)
             * ============================ */

            // Crear nueva columna int
            migrationBuilder.AddColumn<int>(
                name: "TargetId_Int",
                table: "DiscountScopes",
                type: "int",
                nullable: true);

            // Eliminar columna vieja Guid
            migrationBuilder.DropColumn(
                name: "TargetId",
                table: "DiscountScopes");

            // Renombrar nueva columna
            migrationBuilder.RenameColumn(
                name: "TargetId_Int",
                table: "DiscountScopes",
                newName: "TargetId");

            /* ============================
             * 2️⃣ Agregar TargetType
             * ============================ */

            migrationBuilder.AddColumn<int>(
                name: "TargetType",
                table: "DiscountScopes",
                type: "int",
                nullable: false,
                defaultValue: 0);

            /* ============================
             * 3️⃣ Relación Discount → DiscountScopes
             * ============================ */

            migrationBuilder.AddColumn<Guid>(
                name: "DiscountId",
                table: "DiscountScopes",
                type: "uniqueidentifier",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_DiscountScopes_DiscountId",
                table: "DiscountScopes",
                column: "DiscountId");

            migrationBuilder.AddForeignKey(
                name: "FK_DiscountScopes_Discounts_DiscountId",
                table: "DiscountScopes",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            /* ============================
             * 4️⃣ Relación Discount → Coupon (1-1)
             * ============================ */

            migrationBuilder.AddColumn<Guid>(
                name: "DiscountId",
                table: "Coupons",
                type: "uniqueidentifier",
                nullable: false);

            migrationBuilder.CreateIndex(
                name: "IX_Coupons_DiscountId",
                table: "Coupons",
                column: "DiscountId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Coupons_Discounts_DiscountId",
                table: "Coupons",
                column: "DiscountId",
                principalTable: "Discounts",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            /* ============================
             * Revertir relación Coupon
             * ============================ */

            migrationBuilder.DropForeignKey(
                name: "FK_Coupons_Discounts_DiscountId",
                table: "Coupons");

            migrationBuilder.DropIndex(
                name: "IX_Coupons_DiscountId",
                table: "Coupons");

            migrationBuilder.DropColumn(
                name: "DiscountId",
                table: "Coupons");

            /* ============================
             * Revertir relación DiscountScopes
             * ============================ */

            migrationBuilder.DropForeignKey(
                name: "FK_DiscountScopes_Discounts_DiscountId",
                table: "DiscountScopes");

            migrationBuilder.DropIndex(
                name: "IX_DiscountScopes_DiscountId",
                table: "DiscountScopes");

            migrationBuilder.DropColumn(
                name: "DiscountId",
                table: "DiscountScopes");

            migrationBuilder.DropColumn(
                name: "TargetType",
                table: "DiscountScopes");

            /* ============================
             * Revertir TargetId int → Guid
             * ============================ */

            migrationBuilder.AddColumn<Guid>(
                name: "TargetId_Guid",
                table: "DiscountScopes",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.DropColumn(
                name: "TargetId",
                table: "DiscountScopes");

            migrationBuilder.RenameColumn(
                name: "TargetId_Guid",
                table: "DiscountScopes",
                newName: "TargetId");
        }
    }
}
