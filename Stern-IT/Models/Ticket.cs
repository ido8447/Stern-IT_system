using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Stern_IT.Models
{
    public class Ticket
    {
         [Key]
         public int ID { get; set; }
         public string Email { get; set; }

         public string Name { get; set; }
         public string Subject { get; set; }
         public string Priority { get; set; }
         public string Description { get; set; }
         public string Created { get; set; }

         public User user { get; set; }
    }
}
