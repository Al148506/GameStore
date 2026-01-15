using Microsoft.AspNetCore.Mvc;

namespace GameStore.Api.Controllers
{
    public class HealthController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
