using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Stern_IT.Models
{
    public class SternItContext : IdentityDbContext<User>
    {
        public DbSet<Report> Reports { get; set; }

        public SternItContext(DbContextOptions options) : base(options)
        {

        }

       

    }

}
