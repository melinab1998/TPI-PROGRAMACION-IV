using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddUserInheritance : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Availabilities_Dentist_DentistId",
                table: "Availabilities");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_HealthPlan_HealthPlanId",
                table: "Patients");

            migrationBuilder.DropTable(
                name: "Dentist");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Patients",
                table: "Patients");

            migrationBuilder.RenameTable(
                name: "Patients",
                newName: "Users");

            migrationBuilder.RenameIndex(
                name: "IX_Patients_HealthPlanId",
                table: "Users",
                newName: "IX_Users_HealthPlanId");

            migrationBuilder.AlterColumn<string>(
                name: "Dni",
                table: "Users",
                type: "TEXT",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "TEXT");

            migrationBuilder.AddColumn<string>(
                name: "LicenseNumber",
                table: "Users",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Password",
                table: "Users",
                type: "TEXT",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "UserType",
                table: "Users",
                type: "TEXT",
                maxLength: 8,
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Users",
                table: "Users",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_Availabilities_Users_DentistId",
                table: "Availabilities",
                column: "DentistId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Users_HealthPlan_HealthPlanId",
                table: "Users",
                column: "HealthPlanId",
                principalTable: "HealthPlan",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Availabilities_Users_DentistId",
                table: "Availabilities");

            migrationBuilder.DropForeignKey(
                name: "FK_Users_HealthPlan_HealthPlanId",
                table: "Users");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Users",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "LicenseNumber",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Password",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "UserType",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "Users",
                newName: "Patients");

            migrationBuilder.RenameIndex(
                name: "IX_Users_HealthPlanId",
                table: "Patients",
                newName: "IX_Patients_HealthPlanId");

            migrationBuilder.AlterColumn<string>(
                name: "Dni",
                table: "Patients",
                type: "TEXT",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "TEXT",
                oldNullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_Patients",
                table: "Patients",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "Dentist",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", nullable: false),
                    LastName = table.Column<string>(type: "TEXT", nullable: false),
                    LicenseNumber = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Dentist", x => x.Id);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_Availabilities_Dentist_DentistId",
                table: "Availabilities",
                column: "DentistId",
                principalTable: "Dentist",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_HealthPlan_HealthPlanId",
                table: "Patients",
                column: "HealthPlanId",
                principalTable: "HealthPlan",
                principalColumn: "Id");
        }
    }
}
