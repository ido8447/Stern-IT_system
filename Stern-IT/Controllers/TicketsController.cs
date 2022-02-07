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
            public string ToManager { get; set; }

        }

        //POST: api/tickets/create-Ticket
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
                ToManager = model.ToManager,
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
            public int TicketId { get; set; }
            public string Status { get; set; }
            public string Email { get; set; }
            public string Subject { get; set; }
            public string Priority { get; set; }
            public string Description { get; set; }
            public string Created { get; set; }
            public string CustomerName { get; set; }
            public string ToManager { get; set; }

        }

        //GET: api/tickets/5
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
                TicketId = applicationTicket.TicketId,
                Email = applicationTicket.Email,
                Status = applicationTicket.Status,
                Subject = applicationTicket.Subject,
                Priority = applicationTicket.Priority,
                Description = applicationTicket.Description

            };

            return ticketViewModel;
        }



        public class GetTicketsModel
        {
            public string Status { get; set; }
            public string Email { get; set; }
        }

        /// <summary>
        /// Function to show tickets on table from postgresSql
        /// </summary>
        /// <returns>List of models with parameters</returns>
        //GET: api/tickets
        [HttpGet("tickets/{email}/{status}")]
        public async Task<ActionResult<IEnumerable<TicketViewModel>>> Tickets(string email, string status)
        {
            var user = await _userManager.FindByEmailAsync(email);
            var roles = await _userManager.GetRolesAsync(user);
            if (roles.Contains("Operator") && !roles.Contains("Administrator"))
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                //Operator get only tickets by his manager name or all
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Status == status && (ticket.ToManager == user.FirstName + " " + user.LastName || ticket.ToManager == "All")).ToListAsync();

                foreach (Models.Ticket ticket in tickets)
                {
                    var ticketsUser = await _userManager.Users.Where(u => u.Email == ticket.Email).FirstOrDefaultAsync();
                    var customerName = await _context.Customers.Where(p => p.CustomerId == ticketsUser.CustomerId).FirstOrDefaultAsync();
                    viewModels.Add(new TicketViewModel()
                    {
                        TicketId = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                        CustomerName = customerName.CustomerName
                    });

                }

                return viewModels;
            }
            else if (roles.Contains("Administrator"))
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();

                //administrator get all tickets
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Status == status).ToListAsync();

                foreach (Models.Ticket ticket in tickets)
                {
                    var ticketsUser = await _userManager.Users.Where(u => u.Email == ticket.Email).FirstOrDefaultAsync();
                    var customerName = await _context.Customers.Where(p => p.CustomerId == ticketsUser.CustomerId).FirstOrDefaultAsync();
                    viewModels.Add(new TicketViewModel()
                    {
                        TicketId = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                        CustomerName = customerName.CustomerName,
                        ToManager = ticket.ToManager

                    });

                }

                return viewModels;
            }
            else
            {
                List<TicketViewModel> viewModels = new List<TicketViewModel>();
                List<Models.Ticket> tickets = await _context.Tickets.Where(ticket => ticket.Email == email).Where(ticket => ticket.Status == status).ToListAsync();
                //

                foreach (Models.Ticket ticket in tickets)
                {
                    var ticketsUser = await _userManager.Users.Where(u => u.Email == ticket.Email).FirstOrDefaultAsync();
                    var customerName = await _context.Customers.Where(p => p.CustomerId == ticketsUser.CustomerId).FirstOrDefaultAsync();

                    viewModels.Add(new TicketViewModel()
                    {
                        TicketId = ticket.TicketId,
                        Status = ticket.Status,
                        Subject = ticket.Subject,
                        Priority = ticket.Priority,
                        Description = ticket.Description,
                        Email = ticket.Email,
                        Created = ticket.Created,
                        CustomerName = customerName.CustomerName
                    });
                }

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
                TicketId = applicationTicket.TicketId,
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
                Id = 0,
            };
        }

        public class TicketChangeStatusModel
        {
            public int TicketId { get; set; }
            public string Status { get; set; }
            public string Priority { get; set; }



        }

        //PUT: api/Ticket/ChangeStatus/5
        /// <summary>
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="model">model of user</param>
        /// <returns>new user model</returns>
        [HttpPut("{TicketId}")]
        public async Task<ActionResult> PutTicketr(TicketChangeStatusModel tcsm, int TicketId)
        {

            var applicationTicket = await _context.Tickets.FindAsync(TicketId);
            if (applicationTicket == null)
            {
                return NotFound();
            }

            _context.Entry(applicationTicket).State = EntityState.Modified;
            try
            {
                //var ticket = await _context.Tickets.FindAsync(tcsm.TicketId);
                //ticket = new Models.Ticket
                //{
                //    Status = tcsm.Status,
                //    Priority = ticket.Priority,
                //    Subject = ticket.Subject,
                //    Description = ticket.Description,
                //    user = ticket.user,
                //    Email = ticket.Email,
                //    Created = ticket.Created,
                //    ToManager = ticket.ToManager,
                //};
                applicationTicket.Status = tcsm.Status;
                applicationTicket.Priority = tcsm.Priority;

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

        [HttpGet("status/{TicketID}")]
        public async Task<object> GETStatus(int TicketID)
        {
            var ticket = await _context.Tickets.Where(p => p.TicketId == TicketID).FirstAsync();
            return ticket.Status;
        }

        [HttpPost("ChangeStatus/{TicketID}")]
        public async Task<object> ChangeStatus(int TicketID)
        {
            var ticket = await _context.Tickets.Where(p => p.TicketId == TicketID).FirstAsync();
            var status = ticket.Status;

            if (status == "Open")
            {
                ticket.Status = "Closed";
            }
            else
            {
                ticket.Status = "Open";

            }
            try
            {
                var result = await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        // customersTicket
        //"https://localhost:5001/api/tickets/customersTicket/2"
        [HttpGet("customersTicket/{CustomerId}")]
        public async Task<object> customersTicket(string CustomerId)
        {
            List<TicketViewModel> tvm_list = new List<TicketViewModel>();
            var users = await _userManager.Users.Where(p => p.CustomerId.ToString() == CustomerId).ToListAsync();
            foreach (var user in users)
            {
                var tickets = await _context.Tickets.Where(p => p.user.Id == user.Id).ToListAsync();
                foreach (var ticket in tickets)
                {
                    tvm_list.Add(new TicketViewModel()
                    {
                        TicketId = ticket.TicketId,
                        Created = ticket.Created,
                        Email = ticket.Email,
                        Description = ticket.Description,
                        Priority = ticket.Priority,
                        Status = ticket.Status,
                        Subject = ticket.Subject
                    });
                }
            }

            return tvm_list;
        }



        // DeleteTicketsByUser
        [HttpDelete("DeleteTicketsByUser/{email}")]
        public async Task<object> DeleteTicketsByUser(string email)
        {
            var tickets = await _context.Tickets.Where(t => t.Email == email).ToListAsync();
            foreach (var ticket in tickets)
            {
                var answers = await _context.Answers.Where(a => a.ticket.TicketId == ticket.TicketId).ToListAsync();
                if (answers.Count > 0)
                {

                    await DeleteAnswer(ticket.TicketId);

                }

                if (ticket == null)
                {
                    return NotFound();
                }
                _context.Tickets.Remove(ticket);
                try
                {

                    await _context.SaveChangesAsync();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
            }
            return Ok();
        }


        //shareTicket
        [HttpPost]
        [Route("shareTicket/{ticketId}")]
        public async Task<object> ShareTicket(string ticketId)
        {
            var ticket = await _context.Tickets.Where(t=>t.TicketId.ToString()==ticketId).FirstOrDefaultAsync();
            ticket.ToManager = "All";
            try
            {
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


