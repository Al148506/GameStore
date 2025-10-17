using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static System.Runtime.InteropServices.JavaScript.JSType;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using GameStore.Api.DTOs.Videogames;

namespace GameStore.Api.Controllers;

[ApiController]
[Route("api/games")]
public class GamesController : ControllerBase
{
    private readonly VideogamesDbContext _db;
    private readonly IMapper _mapper;
    public GamesController(VideogamesDbContext db, IMapper mapper)
    {
        _db = db;
        _mapper = mapper;
    }

    [HttpGet]
    public async Task<IActionResult> List(int page = 1, int pageSize = 20)
    {
        var query = _db.Videogames.AsNoTracking();

        var total = await query.CountAsync();

        var items = await query
             .OrderBy(v => v.Name)
             .Skip((page - 1) * pageSize)
             .Take(pageSize)
             .ProjectTo<VideogameDTO>(_mapper.ConfigurationProvider)
             .ToListAsync();

        return Ok(new { page, pageSize, total, items });
    }


    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id, CancellationToken ct)
    {
        var vdto = await _db.Videogames
            .AsNoTracking()
            .Where(v => v.Id == id)
            .ProjectTo<VideogameDTO>(_mapper.ConfigurationProvider)
            .FirstOrDefaultAsync(ct);

        if (vdto is null) return NotFound();
        return Ok(vdto);
    }
    [Authorize(Policy = "RequireAdmin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateVideogameRequestDto createDto)
    {
            var vg = new Videogame
            {
                Name = createDto.Name,
                Description = createDto.Description,
                ReleaseDate = createDto.ReleaseDate,
                Price = createDto.Price,
                Stock = createDto.Stock,
                ImageUrl = createDto.ImageUrl,
                Rating = createDto.Rating
            };
            // Asociar géneros si se proporcionan
            if (createDto.GenreIds is not null)
            {
                var genres = await _db.Genres
                    .Where(g => createDto.GenreIds.Contains(g.Id))
                    .ToListAsync();
                vg.Genres = genres;
            }
            // Asociar plataformas si se proporcionan
            if (createDto.PlatformIds is not null)
            {
                var platforms = await _db.Platforms
                    .Where(p => createDto.PlatformIds.Contains(p.Id))
                    .ToListAsync();
                vg.Platforms = platforms;
            }
            _db.Videogames.Add(vg);
            await _db.SaveChangesAsync();
            return CreatedAtAction(nameof(Get), new { id = vg.Id }, vg);

        }



    [Authorize(Policy = "RequireAdmin")]
    [HttpPut("{id}")]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateVideogameRequestDto updateDto)
    {
        var vg = await _db.Videogames
            .Include(v => v.Genres)
            .Include(v => v.Platforms)
            .FirstOrDefaultAsync(v => v.Id == id);

        if (vg is null) return NotFound();

        // Actualizar propiedades básicas
        _mapper.Map(updateDto, vg);

        // Actualizar colecciones de manera compacta
        if (updateDto.GenreIds is not null)
        {
            var newGenres = await _db.Genres
                .Where(g => updateDto.GenreIds.Contains(g.Id))
                .ToListAsync();

            // Sincronizar géneros
            vg.Genres = vg.Genres
                .Where(g => updateDto.GenreIds.Contains(g.Id))
                .Union(newGenres.Where(g => !vg.Genres.Any(eg => eg.Id == g.Id)))
                .ToList();
        }

        if (updateDto.PlatformIds is not null)
        {
            var newPlatforms = await _db.Platforms
                .Where(p => updateDto.PlatformIds.Contains(p.Id))
                .ToListAsync();

            // Sincronizar plataformas
            vg.Platforms = vg.Platforms
                .Where(p => updateDto.PlatformIds.Contains(p.Id))
                .Union(newPlatforms.Where(p => !vg.Platforms.Any(ep => ep.Id == p.Id)))
                .ToList();
        }

        await _db.SaveChangesAsync();
        // Mapear a DTO con AutoMapper
        var vgDto = _mapper.Map<VideogameDTO>(vg);

        return Ok(vgDto);
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
