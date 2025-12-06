using System.Text;
using GameStore.Infrastructure.Persistence.Videogames; // tu DbContext DB-First
using GameStore.Infrastructure.Persistence.Auth;        // IdentityDbContext
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using GameStore.Api.Helper;
using GameStore.Api.AutoMapper;
using System.Text.Json.Serialization;
using Stripe;


var builder = WebApplication.CreateBuilder(args);
StripeConfiguration.ApiKey = builder.Configuration["Stripe:SecretKey"];
// Serilog básico a consola
builder.Host.UseSerilog((ctx, lc) => lc.ReadFrom.Configuration(ctx.Configuration)
                                       .Enrich.FromLogContext()
                                       .WriteTo.Console());


builder.Services.AddDbContext<VideogamesDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("VideogamesDbConnection")));

builder.Services.AddDbContext<ApplicationAuthDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("AuthDbConnection")));

// Identity Core + Roles
builder.Services.AddIdentityCore<ApplicationUser>(o =>
{
    o.User.RequireUniqueEmail = true;
    o.Password.RequiredLength = 8;
    o.Password.RequireNonAlphanumeric = true;
})
.AddRoles<IdentityRole>()
.AddEntityFrameworkStores<ApplicationAuthDbContext>()
.AddSignInManager();

// JWT
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!));

builder.Services.AddAuthentication(opt =>
{
    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(opt =>
{
    opt.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateIssuerSigningKey = true,
        ValidateLifetime = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = key
    };
});

builder.Services.AddAuthorization(opt =>
{
    opt.AddPolicy("RequireAdmin", p => p.RequireRole("Admin"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173") // or use appsettings
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); // si usas cookies / credenciales
    });
});

builder.Services.AddControllers();
// Sustituir la línea problemática por la forma correcta de registrar múltiples perfiles de AutoMapper
builder.Services.AddAutoMapper(
    typeof(VideogameProfile),
    typeof(OrdersProfile),
    typeof(CartProfile)
);

// Swagger + esquema Bearer
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    var scheme = new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Bearer {token}",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        Reference = new Microsoft.OpenApi.Models.OpenApiReference
        {
            Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
            Id = "Bearer"
        }
    };
    c.AddSecurityDefinition("Bearer", scheme);
    c.AddSecurityRequirement(new()
    {
        [scheme] = new List<string>()
    });
});

builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
    options.JsonSerializerOptions.WriteIndented = true;
});

Console.WriteLine("JWT KEY: " + builder.Configuration["Jwt:Key"]);
Console.WriteLine("JWT ISSUER: " + builder.Configuration["Jwt:Issuer"]);
Console.WriteLine("JWT AUDIENCE: " + builder.Configuration["Jwt:Audience"]);



var app = builder.Build();

// CorrelationId en headers + logs
app.Use(async (ctx, next) =>
{
    const string H = "X-Correlation-Id";
    if (!ctx.Request.Headers.TryGetValue(H, out var id) || string.IsNullOrWhiteSpace(id))
    {
        id = Guid.NewGuid().ToString();
        ctx.Request.Headers[H] = id;
    }
    ctx.Response.Headers[H] = id!;
    using (Serilog.Context.LogContext.PushProperty("CorrelationId", id!.ToString()))
    {
        await next();
    }
});

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseSerilogRequestLogging();
app.UseHttpsRedirection();
app.UseCors("AllowFrontend");
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
await app.PromoteAdminFromConfigAsync();

app.Run();

