using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class MigrationTimeSpam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeSpan>(
                name: "StartTime",
                table: "Availabilities",
                type: "time(0)",
                nullable: false,
                oldClrType: typeof(TimeOnly),
                oldType: "time");

            migrationBuilder.AlterColumn<TimeSpan>(
                name: "EndTime",
                table: "Availabilities",
                type: "time(0)",
                nullable: false,
                oldClrType: typeof(TimeOnly),
                oldType: "time");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<TimeOnly>(
                name: "StartTime",
                table: "Availabilities",
                type: "time",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time(0)");

            migrationBuilder.AlterColumn<TimeOnly>(
                name: "EndTime",
                table: "Availabilities",
                type: "time",
                nullable: false,
                oldClrType: typeof(TimeSpan),
                oldType: "time(0)");
        }
    }
}
