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
        public DbSet<Attathment> Attathments { get; set; }





        public SternItContext(DbContextOptions options) : base(options)
        {

        }

        //protected override void OnModelCreating(ModelBuilder builder)
        //{
        //    builder.Entity<Customer>(entity =>
        //    {
        //        entity.HasKey(x => x.CustomerId);
        //    });
        //    builder.Entity<User>(entity =>
        //    {
        //        entity.HasKey(x => x.Id);
        //        entity.HasOne<Customer>().WithMany(c => c.user).HasForeignKey(c => c.CustomerId);
        //    });
        //}

    }

}
