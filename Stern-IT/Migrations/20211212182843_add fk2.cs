using Microsoft.EntityFrameworkCore.Migrations;

namespace Stern_IT.Migrations
{
    public partial class addfk2 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_AspNetUsers_userId",
                table: "Reports");

            migrationBuilder.RenameColumn(
                name: "userId",
                table: "Reports",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_Reports_userId",
                table: "Reports",
                newName: "IX_Reports_UserId");

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

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "Reports",
                newName: "userId");

            migrationBuilder.RenameIndex(
                name: "IX_Reports_UserId",
                table: "Reports",
                newName: "IX_Reports_userId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_AspNetUsers_userId",
                table: "Reports",
                column: "userId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
