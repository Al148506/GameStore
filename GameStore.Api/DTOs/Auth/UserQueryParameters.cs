namespace GameStore.Api.DTOs.Auth
{
    public class UserQueryParameters
    {
        public string? Search { get; set; }  // email o username
        public string SortBy { get; set; } = "UserName"; // UserName | Email
        public string SortDir { get; set; } = "asc";      // asc | desc
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 10;
    }
}
