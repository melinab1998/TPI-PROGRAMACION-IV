using Infrastructure.Data;
using Infrastructure.Services;
using Application.Interfaces;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Application.Services;
using Domain.Interfaces;
using Web.Middleware;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();

// Configuración CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") 
            .AllowAnyHeader()
            .AllowAnyMethod();
        });
});

// Swagger + configuración para JWT
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(setup =>
{
    setup.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        Description = "Ingrese el token generado al loguearse."
    });

    setup.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});

// Configuración SQLite
var connection = new SqliteConnection("Data Source=WebApiTurn.db");
connection.Open();
using (var command = connection.CreateCommand())
{
    command.CommandText = "PRAGMA journal_mode = DELETE;";
    command.ExecuteNonQuery();
}

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connection)); 

// Configuración JWT
var secretKey = builder.Configuration["Authentication:SecretForKey"];
if (string.IsNullOrEmpty(secretKey))
    throw new Exception("La clave de autenticación no está configurada en appsettings.");

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Authentication:Issuer"],
            ValidAudience = builder.Configuration["Authentication:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey))
        };
    });

// Inyección de dependencias
builder.Services.AddScoped<AuthenticationService>();
builder.Services.AddScoped<DentistService>();
builder.Services.AddScoped<PatientService>();
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDentistRepository, DentistRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasherService>();
builder.Services.AddTransient<GlobalExceptionHandlingMiddleware>();


var app = builder.Build();

// Crear SuperAdmin una sola vez al iniciar la app
using (var scope = app.Services.CreateScope())
{
    var authService = scope.ServiceProvider.GetRequiredService<AuthenticationService>();
    var superAdminConfig = new
    {
        FirstName = builder.Configuration["SuperAdmin:FirstName"]!,
        LastName  = builder.Configuration["SuperAdmin:LastName"]!,
        Email     = builder.Configuration["SuperAdmin:Email"]!,
        Password  = builder.Configuration["SuperAdmin:Password"] ?? "SuperAdmin123!"
    };

    authService.CreateSuperAdminOnce(
        superAdminConfig.FirstName,
        superAdminConfig.LastName,
        superAdminConfig.Email,
        superAdminConfig.Password
    );
}


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Usar CORS antes de Authentication/Authorization
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

app.MapControllers();
app.Run();
