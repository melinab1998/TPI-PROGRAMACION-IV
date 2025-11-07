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

// Se agregan los controladores al contenedor de servicios del proyecto.
builder.Services.AddControllers();

// Configuración de CORS para permitir que el frontend (React en este caso) 
// pueda comunicarse con el backend sin bloqueos de seguridad.
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

// Configuración de Swagger con autenticación JWT para la documentación interactiva de la API.
// Esto permite probar los endpoints protegidos ingresando un token desde Swagger.
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

// Configuración de la base de datos utilizando la cadena de conexión definida en appsettings.json.
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
    throw new Exception("La cadena de conexión 'DefaultConnection' no está configurada en appsettings.json");

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(connectionString));

// Configuración del sistema de autenticación JWT.
// Se valida que exista una clave secreta en appsettings.json y se definen los parámetros de validación.
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
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey)),
        };
    });

// Registro de dependencias del proyecto (inyección de dependencias).
// Aquí se vinculan las interfaces con sus implementaciones concretas, 
// para que los servicios puedan resolverlas automáticamente.
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IDentistService, DentistService>();
builder.Services.AddScoped<IPatientService, PatientService>();
builder.Services.AddScoped<IHealthInsuranceService, HealthInsuranceService>();
builder.Services.AddScoped<IHealthPlanService, HealthPlanService>();
builder.Services.AddScoped<IAvailabilityService, AvailabilityService>();
builder.Services.AddScoped<ITurnService, TurnService>();
builder.Services.AddScoped<IVisitRecordService, VisitRecordService>();
builder.Services.AddScoped<IContactMessageService, ContactMessageService>();

// Repositorios genéricos y específicos de cada entidad.
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IDentistRepository, DentistRepository>();
builder.Services.AddScoped<IPatientRepository, PatientRepository>();
builder.Services.AddScoped<IHealthInsuranceRepository, HealthInsuranceRepository>();
builder.Services.AddScoped<IHealthPlanRepository, HealthPlanRepository>();
builder.Services.AddScoped<IAvailabilityRepository, AvailabilityRepository>();
builder.Services.AddScoped<ITurnRepository, TurnRepository>();
builder.Services.AddScoped<IVisitRecordRepository, VisitRecordRepository>();
builder.Services.AddScoped<IContactMessageRepository, ContactMessageRepository>();

// Servicios adicionales utilizados en el sistema.
builder.Services.AddHttpClient<IEmailService, EmailService>();
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IPasswordHasher, PasswordHasherService>();

// Jobs en segundo plano que se ejecutan automáticamente en intervalos definidos.
// AppointmentReminderJob: envía recordatorios de turnos por correo.
// CompletePendingTurnsJob: marca turnos antiguos como completados.
builder.Services.AddHostedService<AppointmentReminderJob>();
builder.Services.AddHostedService<CompletePendingTurnsJob>();

// Middleware global de manejo de excepciones para capturar y devolver errores de manera uniforme.
builder.Services.AddTransient<GlobalExceptionHandlingMiddleware>();

var app = builder.Build();

// Aplicar migraciones automáticamente.
using (var serviceScope = app.Services.CreateScope())
{
    var dbContext = serviceScope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    dbContext.Database.Migrate();
}

// Al iniciar la aplicación, se verifica si existe un SuperAdmin en la base de datos.
// Si no existe, se crea automáticamente utilizando los datos definidos en appsettings.json.
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

// Configuración del pipeline de la aplicación.
// Define el orden en que se ejecutan los middlewares durante cada solicitud HTTP.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// El middleware global de manejo de errores se coloca al inicio para interceptar excepciones.
app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

// Se habilita CORS antes de la autenticación para permitir solicitudes desde el frontend.
app.UseCors("AllowFrontend");

// Activación de los middlewares de autenticación y autorización.
app.UseAuthentication();
app.UseAuthorization();

// Se mapean los controladores, que contienen los endpoints de la API.
app.MapControllers();

// Finalmente, se inicia la aplicación.
app.Run();

