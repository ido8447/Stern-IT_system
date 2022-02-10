using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Stern_IT.Models
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }
        public string Email { get; set; }
        public string Status { get; set; }
        public string Subject { get; set; }
        public string Priority { get; set; }
        public string Description { get; set; }
        public string FileURL { get; set; }
        public string Created { get; set; }
        public string ToManager { get; set; }
        public User user { get; set; }
        public List<Answer> answer { get; set; }
        
    }
}
