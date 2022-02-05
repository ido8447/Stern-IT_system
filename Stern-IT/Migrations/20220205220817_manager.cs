using Microsoft.EntityFrameworkCore.Migrations;

namespace Stern_IT.Migrations
{
    public partial class manager : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ToManagerName",
                table: "Tickets");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ToManagerName",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
