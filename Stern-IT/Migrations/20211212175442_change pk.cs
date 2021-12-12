using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Stern_IT.Migrations
{
    public partial class changepk : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_Customers_CustomerEmail",
                table: "Reports");

            migrationBuilder.DropTable(
                name: "Customers");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reports",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_CustomerEmail",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "CustomerEmail",
                table: "Reports");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Reports",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(
                name: "ID",
                table: "Reports",
                nullable: false,
                defaultValue: 0)
                .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn);

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Reports",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reports",
                table: "Reports",
                column: "ID");

            migrationBuilder.CreateIndex(
                name: "IX_Reports_UserId",
                table: "Reports",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_AspNetUsers_UserId",
                table: "Reports",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_AspNetUsers_UserId",
                table: "Reports");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Reports",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_UserId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "ID",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Reports");

            migrationBuilder.AlterColumn<string>(
                name: "Email",
                table: "Reports",
                type: "text",
                nullable: false,
                oldClrType: typeof(string),
                oldNullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CustomerEmail",
                table: "Reports",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Reports",
                table: "Reports",
                column: "Email");

            migrationBuilder.CreateTable(
                name: "Customers",
                columns: table => new
                {
                    Email = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Customers", x => x.Email);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Reports_CustomerEmail",
                table: "Reports",
                column: "CustomerEmail");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_Customers_CustomerEmail",
                table: "Reports",
                column: "CustomerEmail",
                principalTable: "Customers",
                principalColumn: "Email",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
