using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Stern_IT.Models
{
    public class DbContext :IdentityDbContext<User>
    {
        public DbContext(DbContextOptions options) :base(options)
        {

        }
    }
}
