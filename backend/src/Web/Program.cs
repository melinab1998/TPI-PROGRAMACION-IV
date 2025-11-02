using Infrastructure.Data;
using Infrastructure.Services;
using Application.Interfaces;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;
using Application.Services;
using Domain.Interfaces;
using Web.Middleware;


var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();

// ---------------- CORS ----------------
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

// ---------------- Swagger + JWT ----------------
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

// ---------------- Base de datos ----------------
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
    throw new Exception("La cadena de conexión 'DefaultConnection' no está configurada en appsettings.json");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// ---------------- JWT ----------------
var secretKey = builder.Configuration["Authentication:SecretForKey"];
if (string.IsNullOrEmpty(secretKey))
    throw new Exception("La clave de autenticación no está configurada en appsettings.json");

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

// ---------------- Inyección de dependencias ----------------
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDentistService, DentistService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IHealthInsuranceService, HealthInsuranceService>();
builder.Services.AddScoped<IHealthPlanService, HealthPlanService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<ITurnService, TurnService>();
builder.Services.AddScoped<IVisitRecordService, VisitRecordService>();

builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDentistRepository, DentistRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IHealthInsuranceRepository, HealthInsuranceRepository>();
builder.Services.AddScoped<IHealthPlanRepository, HealthPlanRepository>();
builder.Services.AddScoped<IAvailabilityRepository, AvailabilityRepository>();
builder.Services.AddScoped<ITurnRepository, TurnRepository>();
builder.Services.AddScoped<IVisitRecordRepository, VisitRecordRepository>();

builder.Services.AddHttpClient<IEmailService, EmailService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasherService>();
builder.Services.AddHostedService<AppointmentReminderJob>();
builder.Services.AddHostedService<CompletePendingTurnsJob>();


builder.Services.AddTransient<GlobalExceptionHandlingMiddleware>();

var app = builder.Build();

// ---------------- Crear SuperAdmin al iniciar ----------------
using (var scope = app.Services.CreateScope())
{
    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();
    var config = builder.Configuration.GetSection("SuperAdmin");

    if (!config.Exists())
        throw new Exception("No se encontró la sección 'SuperAdmin' en appsettings.json.");

    var superAdmin = new
    {
        FirstName = config["FirstName"] ?? throw new Exception("Falta SuperAdmin:FirstName"),
        LastName = config["LastName"] ?? throw new Exception("Falta SuperAdmin:LastName"),
        Email = config["Email"] ?? throw new Exception("Falta SuperAdmin:Email"),
        Password = config["Password"] ?? throw new Exception("Falta SuperAdmin:Password")
    };

    userService.CreateSuperAdminOnce(
        superAdmin.FirstName,
        superAdmin.LastName,
        superAdmin.Email,
        superAdmin.Password
    );
}

// ---------------- Pipeline ----------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Middleware global de manejo de errores primero
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

// CORS antes de Auth
app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();

