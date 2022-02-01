using Microsoft.EntityFrameworkCore.Migrations;

namespace Stern_IT.Migrations
{
    public partial class addfk1 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "userId",
                table: "Reports",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Reports_userId",
                table: "Reports",
                column: "userId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reports_AspNetUsers_userId",
                table: "Reports",
                column: "userId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reports_AspNetUsers_userId",
                table: "Reports");

            migrationBuilder.DropIndex(
                name: "IX_Reports_userId",
                table: "Reports");

            migrationBuilder.DropColumn(
                name: "userId",
                table: "Reports");

            migrationBuilder.AddColumn<string>(
                name: "UserIDId",
                table: "Reports",
                type: "text",
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
    }
}
