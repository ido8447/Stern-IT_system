using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace Stern_IT.Models
{
    public class Customer
    {
        public string CustomerName { get; set; }
        public int CustomerId { get; set; }
        public List<User> user { get; set; }
    }
}
