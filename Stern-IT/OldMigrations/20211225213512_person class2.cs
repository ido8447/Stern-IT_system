using Microsoft.EntityFrameworkCore.Migrations;

namespace Stern_IT.Migrations
{
    public partial class personclass2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AspNetUsers_Persons_User",
                table: "AspNetUsers");

            migrationBuilder.DropIndex(
                name: "IX_AspNetUsers_User",
                table: "AspNetUsers");

            migrationBuilder.DropColumn(
                name: "User",
                table: "AspNetUsers");

            migrationBuilder.AddColumn<string>(
                name: "Person",
                table: "Persons",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Persons_Person",
                table: "Persons",
                column: "Person",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Persons_AspNetUsers_Person",
                table: "Persons",
                column: "Person",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Persons_AspNetUsers_Person",
                table: "Persons");

            migrationBuilder.DropIndex(
                name: "IX_Persons_Person",
                table: "Persons");

            migrationBuilder.DropColumn(
                name: "Person",
                table: "Persons");

            migrationBuilder.AddColumn<int>(
                name: "User",
                table: "AspNetUsers",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_AspNetUsers_User",
                table: "AspNetUsers",
                column: "User",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_AspNetUsers_Persons_User",
                table: "AspNetUsers",
                column: "User",
                principalTable: "Persons",
                principalColumn: "userId",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
