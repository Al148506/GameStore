using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using GameStore.Api.DTOs.Videogames;
using GameStore.Api.Helper;

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
    [HttpGet]
    public async Task<IActionResult> List(
    int page = 1,
    int pageSize = 20,
    string? search = null,
    string? sort = null,
    [FromQuery] int[]? genreIds = null,
    [FromQuery] int[]? platformIds = null)
    {
        var query = _db.Videogames
            .AsNoTracking()
            .Include(v => v.Genres)
            .Include(v => v.Platforms)
            .AsQueryable();

        // 🔎 FILTRO: búsqueda por nombre
        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(v => v.Name.Contains(search));

        // 🔎 FILTRO por géneros
        if (genreIds is { Length: > 0 })
        {
            query = query.Where(v =>
                v.Genres.Any(g => genreIds.Contains(g.Id))
            );
        }

        // 🔎 FILTRO por plataformas
        if (platformIds is { Length: > 0 })
        {
            query = query.Where(v =>
                v.Platforms.Any(p => platformIds.Contains(p.Id))
            );
        }

        // 🔽 ORDENAMIENTO GLOBAL
        query = sort switch
        {
            "az" => query.OrderBy(v => v.Name),
            "za" => query.OrderByDescending(v => v.Name),
            "low-high" => query.OrderBy(v => v.Price),
            "high-low" => query.OrderByDescending(v => v.Price),
            _ => query.OrderBy(v => v.Name)
        };

        var total = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ProjectTo<VideogameDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();

        return Ok(new PaginatedResponse<VideogameDTO>
        {
            Page = page,
            PageSize = pageSize,
            Total = total,
            Items = items
        });
    }




    [HttpGet("genres")]
    public async Task<IActionResult> ListGenres()
    {
        var genres = await _db.Genres
            .AsNoTracking()
            .OrderBy(g => g.Name)
            .ProjectTo<GenreDTO>(_mapper.ConfigurationProvider)
            .ToListAsync();
        return Ok(genres);
    }
    [HttpGet("platforms")]
    public async Task<IActionResult> ListPlatforms()
    {
        var platforms = await _db.Platforms
            .AsNoTracking()
            .OrderBy(p => p.Name)
            .ToListAsync();
        return Ok(platforms);
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
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

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
     
        var genres = await _db.Genres
                    .Where(g => createDto.GenreIds.Contains(g.Id))
                    .ToListAsync();
                if (genres.Count != createDto.GenreIds.Count)
                {
                    return BadRequest("One or more genres do not exist.");
                }
                vg.Genres = genres;
      
        var platforms = await _db.Platforms
                    .Where(p => createDto.PlatformIds.Contains(p.Id))
                    .ToListAsync();
        if (platforms.Count != createDto.PlatformIds.Count)
        {
            return BadRequest("One or more platforms do not exist.");
        }
        vg.Platforms = platforms;
            _db.Videogames.Add(vg);
            await _db.SaveChangesAsync();
            return Ok(vg);

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
