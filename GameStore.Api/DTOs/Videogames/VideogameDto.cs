namespace GameStore.Api.DTOs.Videogames
{
    public class VideogameDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public DateTime ReleaseDate { get; set; }
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public string ImageUrl { get; set; }
        public string Rating { get; set; }
        public List<string> Genres { get; set; }
        public List<string> Platforms { get; set; }
    }

}
