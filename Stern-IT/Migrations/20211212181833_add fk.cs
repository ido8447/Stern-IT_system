using Microsoft.EntityFrameworkCore.Migrations;

namespace Stern_IT.Migrations
{
    public partial class addfk : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_AspNetUsers_UserId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_UserId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Reports");

            migrationBuilder.AddColumn<string>(
                name: "UserIDId",
                table: "Reports",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_UserIDId",
                table: "Reports",
                column: "UserIDId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_AspNetUsers_UserIDId",
                table: "Reports",
                column: "UserIDId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_AspNetUsers_UserIDId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_UserIDId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "UserIDId",
                table: "Reports");

            migrationBuilder.AddColumn<string>(
                name: "UserId",
                table: "Reports",
                type: "text",
                nullable: true);

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
    }
}
