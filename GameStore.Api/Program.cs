using System.Text;
using GameStore.Infrastructure.Persistence.Videogames; // tu DbContext DB-First
using GameStore.Infrastructure.Persistence.Auth;        // IdentityDbContext
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using GameStore.Api.Helper;

var builder = WebApplication.CreateBuilder(args);

// Serilog b�sico a consola
builder.Host.UseSerilog((ctx, lc) => lc.ReadFrom.Configuration(ctx.Configuration)
                                       .Enrich.FromLogContext()
                                       .WriteTo.Console());

// Db cat�logo (DB-First a VideogamesDB)
builder.Services.AddDbContext<VideogamesDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Db auth (Identity) apuntando a la MISMA BD (AspNet* ya existen)
builder.Services.AddDbContext<ApplicationAuthDbContext>(o =>
    o.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

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

builder.Services.AddControllers();

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
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
await app.PromoteAdminFromConfigAsync();
app.Run();

