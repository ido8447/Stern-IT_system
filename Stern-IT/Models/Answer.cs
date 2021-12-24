using System;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Stern_IT.Models
{
    public class Answer
    {
        [Key]
        public int AnswerId { get; set; }
        public string Email { get; set; }
        public string Description { get; set; }
        public bool IsManager { get; set; }
        public string Created { get; set; }

        public  Ticket ticket { get; set; }
    }
}
