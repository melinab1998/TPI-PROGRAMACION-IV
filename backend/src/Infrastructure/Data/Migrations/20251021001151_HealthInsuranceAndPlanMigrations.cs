using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Infrastructure.Data.Migrations
{
    /// <inheritdoc />
    public partial class HealthInsuranceAndPlanMigrations : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthPlan_HealthInsurance_HealthInsuranceId",
                table: "HealthPlan");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_HealthPlan_HealthPlanId",
                table: "Patients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HealthPlan",
                table: "HealthPlan");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HealthInsurance",
                table: "HealthInsurance");

            migrationBuilder.RenameTable(
                name: "HealthPlan",
                newName: "HealthPlans");

            migrationBuilder.RenameTable(
                name: "HealthInsurance",
                newName: "HealthInsurances");

            migrationBuilder.RenameIndex(
                name: "IX_HealthPlan_HealthInsuranceId",
                table: "HealthPlans",
                newName: "IX_HealthPlans_HealthInsuranceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HealthPlans",
                table: "HealthPlans",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HealthInsurances",
                table: "HealthInsurances",
                column: "Id");

            migrationBuilder.InsertData(
                table: "HealthInsurances",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { 1, "OSDE" },
                    { 2, "Swiss Medical" },
                    { 3, "Galeno" },
                    { 4, "Particular" }
                });

            migrationBuilder.InsertData(
                table: "HealthPlans",
                columns: new[] { "Id", "HealthInsuranceId", "Name" },
                values: new object[,]
                {
                    { 1, 1, "210" },
                    { 2, 1, "310" },
                    { 3, 1, "410" },
                    { 4, 2, "SMG01" },
                    { 5, 2, "SMG02" },
                    { 6, 3, "220" },
                    { 7, 3, "330" }
                });

            migrationBuilder.AddForeignKey(
                name: "FK_HealthPlans_HealthInsurances_HealthInsuranceId",
                table: "HealthPlans",
                column: "HealthInsuranceId",
                principalTable: "HealthInsurances",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Patients_HealthPlans_HealthPlanId",
                table: "Patients",
                column: "HealthPlanId",
                principalTable: "HealthPlans",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_HealthPlans_HealthInsurances_HealthInsuranceId",
                table: "HealthPlans");

            migrationBuilder.DropForeignKey(
                name: "FK_Patients_HealthPlans_HealthPlanId",
                table: "Patients");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HealthPlans",
                table: "HealthPlans");

            migrationBuilder.DropPrimaryKey(
                name: "PK_HealthInsurances",
                table: "HealthInsurances");

            migrationBuilder.DeleteData(
                table: "HealthInsurances",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "HealthPlans",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "HealthPlans",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "HealthPlans",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "HealthPlans",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "HealthPlans",
                keyColumn: "Id",
                keyValue: 5);

            migrationBuilder.DeleteData(
                table: "HealthPlans",
                keyColumn: "Id",
                keyValue: 6);

            migrationBuilder.DeleteData(
                table: "HealthPlans",
                keyColumn: "Id",
                keyValue: 7);

            migrationBuilder.DeleteData(
                table: "HealthInsurances",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "HealthInsurances",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "HealthInsurances",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.RenameTable(
                name: "HealthPlans",
                newName: "HealthPlan");

            migrationBuilder.RenameTable(
                name: "HealthInsurances",
                newName: "HealthInsurance");

            migrationBuilder.RenameIndex(
                name: "IX_HealthPlans_HealthInsuranceId",
                table: "HealthPlan",
                newName: "IX_HealthPlan_HealthInsuranceId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HealthPlan",
                table: "HealthPlan",
                column: "Id");

            migrationBuilder.AddPrimaryKey(
                name: "PK_HealthInsurance",
                table: "HealthInsurance",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_HealthPlan_HealthInsurance_HealthInsuranceId",
                table: "HealthPlan",
                column: "HealthInsuranceId",
                principalTable: "HealthInsurance",
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
