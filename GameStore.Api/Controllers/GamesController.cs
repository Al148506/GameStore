using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using GameStore.Api.DTOs;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace GameStore.Api.Controllers;

[ApiController]
[Route("api/games")]
public class GamesController : ControllerBase
{
    private readonly VideogamesDbContext _db;
    public GamesController(VideogamesDbContext db) => _db = db;

    [HttpGet]
    public async Task<IActionResult> List(int page = 1, int pageSize = 20)
    {
        var query = _db.Videogames.AsNoTracking();

        var total = await query.CountAsync();

        var items = await query
            .OrderBy(v => v.Name)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(v => new VideogameDTO
            {
                Id = v.Id,
                Name = v.Name,
                Genres = v.Genres
                .OrderBy(g => g.Name)   // opcional: devuelve ordenado alfabéticamente
                .Select(g => g.Name)
                .ToList(),
                Platforms = v.Platforms
                .OrderBy(p => p.Name)   // opcional
                .Select(p => p.Name)
                .ToList()
            })
            .ToListAsync();

        return Ok(new { page, pageSize, total, items });
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var vdto = await _db.Videogames
            .AsNoTracking()
            .Where(v => v.Id == id)
            .Select(v => new VideogameDTO
            {
                Id = v.Id,
                Name = v.Name,
                Genres = v.Genres
                    .OrderBy(g => g.Name)
                    .Select(g => g.Name)
                    .ToList(),
                Platforms = v.Platforms
                    .OrderBy(p => p.Name)
                    .Select(p => p.Name)
                    .ToList()
            })
            .FirstOrDefaultAsync(ct);

        if (vdto is null) return NotFound();
        return Ok(vdto);
    }

    [Authorize(Policy = "RequireAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVideogameRequestDto updateDto)
    {
        // Buscar el videojuego por id
        var vg = await _db.Videogames.FirstOrDefaultAsync(v => v.Id == id);
        if (vg is null) return NotFound();
        vg.Name = updateDto.Name;
        vg.Description = updateDto.Description;
        vg.ReleaseDate = updateDto.ReleaseDate;
        vg.Price = updateDto.Price;
        vg.Stock = updateDto.Stock;
        vg.ImageUrl = updateDto.ImageUrl;
        vg.Rating = updateDto.Rating;
        // Actualizar géneros si se proporcionan
        if (updateDto.GenreIds is not null)
        {
            var genres = await _db.Genres
                .Where(g => updateDto.GenreIds.Contains(g.Id))
                .ToListAsync();
            vg.Genres = genres;
        }

        // Actualizar plataformas si se proporcionan
        if (updateDto.PlatformIds is not null)
        {
            var platforms = await _db.Platforms
                .Where(p => updateDto.PlatformIds.Contains(p.Id))
                .ToListAsync();
            vg.Platforms = platforms;
        }

        await _db.SaveChangesAsync();
        return Ok(vg);
    }

    [Authorize(Policy = "RequireAdmin")]
    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var vg = await _db.Videogames.FirstOrDefaultAsync(v => v.Id == id);
        if (vg is null) return NotFound();
        _db.Videogames.Remove(vg);
        await _db.SaveChangesAsync();
        return NoContent();
    }


}
