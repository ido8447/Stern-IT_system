using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Stern_IT.Models
{
    public class Report
    {
         [Key]
         public int ID { get; set; }
         public string Name { get; set; }
         public string Subject { get; set; }
         public string Priority { get; set; }
         public string Description { get; set; }

         public User user { get; set; }
    }
}
