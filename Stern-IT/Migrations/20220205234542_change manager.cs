using Microsoft.EntityFrameworkCore.Migrations;

namespace Stern_IT.Migrations
{
    public partial class changemanager : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            

            migrationBuilder.AddColumn<string>(
                name: "ToManager",
                table: "Tickets",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ToManager",
                table: "Tickets");

            migrationBuilder.AddColumn<string>(
                name: "ToManagerName",
                table: "Tickets",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
