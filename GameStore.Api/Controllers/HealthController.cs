using GameStore.Infrastructure.Persistence.Videogames;
using GameStore.Infrastructure.Persistence.Auth;
using Microsoft.AspNetCore.Mvc;
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class HealthController : ControllerBase
    {
        private readonly VideogamesDbContext _dbVideogames;
        private readonly ApplicationAuthDbContext _dbAuth;

        public HealthController(ApplicationAuthDbContext dbAuth, VideogamesDbContext dbVideogames)
        {
            _dbAuth = dbAuth;
            _dbVideogames = dbVideogames;
        }

        [HttpGet("warmup")]
        [AllowAnonymous]
        public async Task<IActionResult> WarmUp()
        {
            try
            {
                await _dbAuth.Database.ExecuteSqlRawAsync("SELECT 1");
                await _dbVideogames.Database.ExecuteSqlRawAsync("SELECT 1");

                return Ok(new { status = "database-awake" });
            }
            catch
            {
                // No exponemos errores ni rompemos el flujo del frontend
                return Ok(new { status = "warming-up" });
            }
        }
    }
}