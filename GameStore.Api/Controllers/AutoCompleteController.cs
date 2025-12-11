using AutoMapper;
using GameStore.Infrastructure.Persistence.Videogames;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace GameStore.Api.Controllers
{
    [ApiController]
    [Route("api/autoComplete")]
    public class AutoCompleteController : Controller
    {
        private readonly VideogamesDbContext _db;
        private readonly IMapper _mapper;
        private readonly IConfiguration _configuration;
        public AutoCompleteController(VideogamesDbContext db, IMapper mapper, IConfiguration configuration)
        {
            _db = db;
            _mapper = mapper;
            _configuration = configuration;
        }

        [HttpGet]
        public async Task<IActionResult> AutocompleteFromRawg(string name)
        {
            var apiKey = _configuration["Rawg:ApiKey"];
            using var client = new HttpClient();

            var url = $"https://api.rawg.io/api/games?search={Uri.EscapeDataString(name)}&key={apiKey}";
            var response = await client.GetAsync(url);

            if (!response.IsSuccessStatusCode)
                return Json(null);

            var json = await response.Content.ReadAsStringAsync();
            var result = JObject.Parse(json);

            var first = result["results"]?.FirstOrDefault();
            if (first == null)
                return Json(null);

            var gameName = first["name"]?.ToString() ?? "";
            var releaseDate = first["released"]?.ToString() ?? "";
            var imageUrl = first["background_image"]?.ToString() ?? "";

            var esrbSlug = "";
            var esrbToken = first["esrb_rating"];
            if (esrbToken != null && esrbToken.Type == JTokenType.Object)
            {
                esrbSlug = esrbToken["slug"]?.ToString() ?? "";
            }
            var gameId = first["id"]?.ToString();

            string description = "";
            List<string> platforms = new();
            List<string> genres = new();

            if (!string.IsNullOrEmpty(gameId))
            {
                var gameDetailsUrl = $"https://api.rawg.io/api/games/{gameId}?key={apiKey}";
                var detailsResponse = await client.GetAsync(gameDetailsUrl);
                if (detailsResponse.IsSuccessStatusCode)
                {
                    var detailJson = await detailsResponse.Content.ReadAsStringAsync();
                    var detail = JObject.Parse(detailJson);

                    description = detail["description_raw"]?.ToString() ?? "";

                    // Extraer plataformas (ej: "PC", "PlayStation 5")
                    platforms = detail["platforms"]
                        ?.Select(p => p["platform"]?["name"]?.ToString())
                        .Where(p => !string.IsNullOrWhiteSpace(p))
                        .Distinct()
                        .ToList() ?? new();

                    // Extraer géneros (ej: "Action", "RPG")
                    genres = detail["genres"]
                        ?.Select(g => g["name"]?.ToString())
                        .Where(g => !string.IsNullOrWhiteSpace(g))
                        .Distinct()
                        .ToList() ?? new();
                }
            }

            return Json(new
            {
                name = gameName,
                description = description,
                rating = esrbSlug,
                releaseDate = releaseDate,
                imageUrl = imageUrl,
                platforms = platforms,
                genres = genres
            });
        }
    }
}
