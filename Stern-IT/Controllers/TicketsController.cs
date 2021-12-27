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
            public string Status { get; set; }
            public string Subject { get; set; }
            public string Priority { get; set; }
            public string Description { get; set; }
            public string Created = DateTime.Now.ToString("dd/MM/yyyy");
            public string ToManagerName { get; set; }

        }

        //POST: api/Users/create-Ticket
        [HttpPost]
        [Route("create-ticket")]
        public async Task<object> CreateTicket(CreateTicketModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            Models.Ticket applicationCreateTicket = new Models.Ticket
            {
                Status = model.Status,
                Priority = model.Priority,
                Subject = model.Subject,
                Description = model.Description,
                user = user,
                Email = user.Email,
                Created = model.Created,
                ToManagerName = model.ToManagerName,
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
            public string Status { get; set; }
            public string Email { get; set; }
            public string Subject { get; set; }
            public string Priority { get; set; }
            public string Description { get; set; }
            public string Created { get; set; }

        }

        //GET: api/Tickets/5
        [HttpGet("{id}")]
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
                Status = applicationTicket.Status,
                Subject = applicationTicket.Subject,
                Priority = applicationTicket.Priority,
                Description = applicationTicket.Description

            };

            return ticketViewModel;
        }




        /// <summary>
        /// Function to show tickets on table from postgresSql
        /// </summary>
        /// <returns>List of models with parameters</returns>
        //GET: api/Tickets
        [HttpGet("tickets/{email}")]
        public async Task<ActionResult<IEnumerable<TicketViewModel>>> Tickets(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Moderator") && !roles.Contains("Administrator"))
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                //List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Status == "Open").Where(ticket=> ticket.ToManagerName == user.FirstName + " " + user.LastName && ticket.ToManagerName == "All").ToListAsync();
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Status == "Open" && (ticket.ToManagerName == user.FirstName + " " + user.LastName || ticket.ToManagerName == "All")).ToListAsync();

                foreach (Models.Ticket ticket in tickets)
                {
                    viewModels.Add(new TicketViewModel()
                    {
                        Id = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                    });

                }

                return viewModels;
            }
            else if (roles.Contains("Administrator"))
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Status == "Open").ToListAsync();

                foreach (Models.Ticket ticket in tickets)
                {
                    viewModels.Add(new TicketViewModel()
                    {
                        Id = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                    });

                }

                return viewModels;
            }
            else
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Email == email).Where(ticket => ticket.Status == "Open").ToListAsync();
                tickets.ForEach(ticket =>
                {
                    viewModels.Add(new TicketViewModel()
                    {
                        Id = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                    });
                });

                return viewModels;
            }


        }




        //GET: api/Tickets/closedtickets/{email}
        [HttpGet("closedtickets/{email}")]
        public async Task<ActionResult<IEnumerable<TicketViewModel>>> GetClosedTickets(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var roles = await _userManager.GetRolesAsync(user);

            if (roles.Contains("Moderator") && !roles.Contains("Administrator"))
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Status == "Closed" && (ticket.ToManagerName == user.FirstName + " " + user.LastName || ticket.ToManagerName == "All")).ToListAsync();
                tickets.ForEach(ticket =>
                {
                    viewModels.Add(new TicketViewModel()
                    {
                        Id = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                    });
                });

                return viewModels;
            }
            else if (roles.Contains("Administrator"))
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Status == "Closed").ToListAsync();
                tickets.ForEach(ticket =>
                {
                    viewModels.Add(new TicketViewModel()
                    {
                        Id = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                    });
                });

                return viewModels;
            }
            else
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Email == email).Where(ticket => ticket.Status == "Closed").ToListAsync();
                tickets.ForEach(ticket =>
                {
                    viewModels.Add(new TicketViewModel()
                    {
                        Id = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                    });
                });

                return viewModels;
            }
        }

        //DELETE: api/tickets/5
        /// <summary>
        /// Delete the current Ticket by his ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        public async Task<ActionResult<TicketViewModel>> DeleteTicket(int id)
        {
            await DeleteAnswer(id);
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
                Status = applicationTicket.Status,
                Subject = applicationTicket.Subject,
                Priority = applicationTicket.Priority,
                Description = applicationTicket.Description
            };

        }

        public async Task<ActionResult<AnsweredTicketViewModel>> DeleteAnswer(int id)
        {
            var applicationAnswers = await _context.Answers.Where(p => p.ticket.TicketId == id).ToListAsync();

            if (applicationAnswers == null)
            {
                return NotFound();
            }
            foreach (var answer in applicationAnswers)
            {
                _context.Answers.Remove(answer);

            }
            await _context.SaveChangesAsync();

            return new AnsweredTicketViewModel()
            {
                Email = "",
                Description = "",
                IsManager = false,
                Id =0,
            };
        }


        //PUT: api/Ticket/5
        /// <summary>
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="model">model of user</param>
        /// <returns>new user model</returns>
        [HttpPut("{id}")]
        public async Task<ActionResult> PutTicketr(string id, TicketViewModel model)
        {
            if (int.Parse(id) != model.Id)
            {
                return BadRequest();
            }
            var applicationTicket = await _context.Users.FindAsync(id);
            if (applicationTicket == null)
            {
                return NotFound();
            }

            _context.Entry(applicationTicket).State = EntityState.Modified;
            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (applicationTicket == null)
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return NoContent();
        }




        public class AnsweredTicketViewModel
        {
            public int Id { get; set; }
            public string Email { get; set; }
            public bool IsManager { get; set; }
            public string Description { get; set; }

        }
        [HttpGet("answer/{id}")]
        public async Task<ActionResult<IEnumerable<AnsweredTicketViewModel>>> GetAnswered(string id)
        {
            List<AnsweredTicketViewModel> viewModels = new List<AnsweredTicketViewModel>();

            var tickets = await _context.Answers.Where(p => p.ticket.TicketId == int.Parse(id)).ToListAsync();
            tickets.ForEach(ticket =>
            {
                viewModels.Add(new AnsweredTicketViewModel()
                {
                    Id = ticket.AnswerId,
                    Description = ticket.Description,
                    Email = ticket.Email,
                    IsManager = ticket.IsManager
                });
            });

            return viewModels;

        }

        public class AnsweredTicketPostModel
        {
            public int TicketId { get; set; }
            public string Email { get; set; }
            public bool IsManager { get; set; }
            public string Answer { get; set; }

        }
        [HttpPost]
        [Route("answer/post")]
        public async Task<object> SendAnswer(AnsweredTicketPostModel model)
        {
            var ticket = await _context.Tickets.Where(p => p.TicketId == model.TicketId).FirstAsync();
            Models.Answer CreateAnswer = new Models.Answer
            {
                ticket = ticket,
                Created = DateTime.Now.ToString("dd.MM.yyyy"),
                Description = model.Answer,
                Email = model.Email,
                IsManager = model.IsManager
            };
            try
            {
                _context.Add(CreateAnswer);
                var result = await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }


        }
    }
}


