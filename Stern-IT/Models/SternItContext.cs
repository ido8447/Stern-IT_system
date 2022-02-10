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
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<Answer> Answers { get; set; }
        public DbSet<Customer> Customers { get; set; }
    //    public DbSet<Attachment> Attachments { get; set; }


        public SternItContext(DbContextOptions options) : base(options)
        {

        }

        // protected override void OnModelCreating(ModelBuilder builder)
        // {
        //    builder.Entity<Ticket>().HasMany(a=>a.Attachments).
          
        // }

    }

}
