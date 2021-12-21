using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Stern_IT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly UserManager<Models.User> _userManager;

        private readonly Models.SternItContext _context;

        public TicketsController(UserManager<Models.User> userManager, Models.SternItContext dbContext)
        {
            _userManager = userManager;
            _context = dbContext;

        }
        public class CreateTicketModel
        {
            public string Email { get; set; }
            public string Name { get; set; }
            public string Subject { get; set; }
            public string Priority { get; set; }
            public string Description { get; set; }
            public string Created = DateTime.Now.ToString("dd/MM/yyyy");

        }

        //POST: api/Users/create-Ticket
        [HttpPost]
        [Route("create-ticket")]
        public async Task<object> CreateTicket(CreateTicketModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            Models.Ticket applicationCreateTicket = new Models.Ticket
            {
                Name = model.Name,
                Priority = model.Priority,
                Subject = model.Subject,
                Description = model.Description,
                user = user,
                Email = user.Email,
                Created = model.Created
            };
            try
            {
                _context.Add(applicationCreateTicket);
                var result = await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }





        /// <summary>
        /// user model class to view on table
        /// </summary>
        public class TicketViewModel
        {
            public int Id { get; set; }
            public string Name { get; set; }
            public string Email { get; set; }
            public string Subject { get; set; }
            public string Priority { get; set; }
            public string Description { get; set; }
            public string Created { get; set; }

        }



        /// <summary>
        /// Function to show tickets on table from postgresSql
        /// </summary>
        /// <returns>List of models with parameters</returns>
        //GET: api/Tickets
        [HttpGet]
        [Authorize(Roles = "Moderator")]
        [Authorize(Roles = "Administrator")]

        public async Task<ActionResult<IEnumerable<TicketViewModel>>> Tickets()
        {
            List<TicketViewModel> viewModels = new List<TicketViewModel>();
            List<Models.Ticket> tickets = await _context.Tickets.ToListAsync();

            foreach (Models.Ticket ticket in tickets)
            {
                viewModels.Add(new TicketViewModel()
                {
                    Id = ticket.TicketId,
                    Name = ticket.Name,
                    Subject = ticket.Subject,
                    Priority = ticket.Priority,
                    Description = ticket.Description,
                    Email = ticket.Email,
                    Created = ticket.Created,
                });

            }

            return viewModels;
        }








        //GET: api/Tickets/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Moderator")]
        [Authorize(Roles = "Administrator")]

        public async Task<ActionResult<TicketViewModel>> GetTicket(int id)
        {
            var applicationTicket = await _context.Tickets.FindAsync(id);

            if (applicationTicket == null)
            {
                return NotFound();
            }
            TicketViewModel ticketViewModel = new TicketViewModel()
            {
                Id = applicationTicket.TicketId,
                Email = applicationTicket.Email,
                Name = applicationTicket.Name,
                Subject = applicationTicket.Subject,
                Priority = applicationTicket.Priority,
                Description = applicationTicket.Description

            };

            return ticketViewModel;
        }



        //GET: api/Tickets/{email}
        [HttpGet("email/{email}")]
        public async Task<ActionResult<IEnumerable<TicketViewModel>>> GetUserTickets(string email)
        {
            List<TicketViewModel> viewModels = new List<TicketViewModel>();
            List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Email == email).ToListAsync();
            tickets.ForEach(ticket =>
            {
                viewModels.Add(new TicketViewModel()
                {
                    Id = ticket.TicketId,
                    Name = ticket.Name,
                    Subject = ticket.Subject,
                    Priority = ticket.Priority,
                    Description = ticket.Description,
                    Email = ticket.Email,
                    Created = ticket.Created,
                });
            });

            return viewModels;
        }






        //DELETE: api/tickets/5
        /// <summary>
        /// Delete the current Ticket by his ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Moderator")]
        [Authorize(Roles = "Administrator")]

        public async Task<ActionResult<TicketViewModel>> DeleteTicket(int id)
        {
            var applicationTicket = await _context.Tickets.FindAsync(id);
            if (applicationTicket == null)
            {
                return NotFound();
            }
            _context.Tickets.Remove(applicationTicket);
            await _context.SaveChangesAsync();

            return new TicketViewModel()
            {
                Id = applicationTicket.TicketId,
                Email = applicationTicket.Email,
                Name = applicationTicket.Name,
                Subject = applicationTicket.Subject,
                Priority = applicationTicket.Priority,
                Description = applicationTicket.Description
            };

        }




    }
}


