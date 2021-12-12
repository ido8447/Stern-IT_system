using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Stern_IT.Models
{
    public class Customer
    {
         [Key]
         public string Email { get; set; }
         public string PhoneNumber { get; set; }
         public List<Report> Reports { get; set; }

    }
}
