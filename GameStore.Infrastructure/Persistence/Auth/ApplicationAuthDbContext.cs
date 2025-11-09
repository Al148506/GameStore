using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GameStore.Infrastructure.Persistence.Auth
{
    public class ApplicationAuthDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationAuthDbContext(DbContextOptions<ApplicationAuthDbContext> options)
    : base(options) { }
    }
}
