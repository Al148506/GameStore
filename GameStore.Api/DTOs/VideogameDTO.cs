namespace GameStore.Api.DTOs
{
    public class VideogameDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = "";
        public List<string> Genres { get; set; } = new();
        public List<string> Platforms { get; set; } = new();
    }
}
