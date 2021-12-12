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
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Stern_IT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<Models.User> _userManager;
        private readonly Models.SternItContext _context;

        //constractor
        public UsersController(UserManager<Models.User> userManager, Models.SternItContext dbContext)
        {
            _userManager = userManager;
            _context = dbContext;
        }
        //

        #region Register
        /// <summary>
        /// Class model to register page
        /// </summary>
        public class UserRegisterModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }

            [Phone]
            public string PhoneNumber { get; set; }


            [Required]
            [StringLength(100, ErrorMessage = "The {0} Must be least {2} and the max {1} charaters long", MinimumLength = 4)]
            [DataType(DataType.Password)]
            public string Password { get; set; }
        }
        //POST: api/Users/Register
        /// <summary>
        /// Function to register on the system
        /// </summary>
        [HttpPost]
        [Route("Register")]
        public async Task<object> Register(UserRegisterModel model)
        {
            var applicationUser = new Models.User()
            {
                UserName = model.Email,
                Email = model.Email,
                PhoneNumber = model.PhoneNumber
            };
            try
            {
                var result = await _userManager.CreateAsync(applicationUser, model.Password);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
        //
        #region Login
        /// <summary>
        /// Class model to Login
        /// </summary>
        public class UserLoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        //POST: api/Users/Login
        /// <summary>
        /// Function to login on the system
        /// </summary>
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(UserLoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                //
                List<Claim> claims = new List<Claim>
                {
                    new Claim("Id", user.Id.ToString()),
                    new Claim("Email", user.Email)
                };
                var roles = await _userManager.GetRolesAsync(user);
                IdentityOptions identityOptions = new IdentityOptions();
                foreach (string role in roles)
                {
                    claims.Add(new Claim(identityOptions.ClaimsIdentity.RoleClaimType, role));
                }

                //
                var securityTokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(claims.ToArray()),
                    //Login stay on 24 hours before quit
                    Expires = DateTime.UtcNow.AddHours(24),
                    SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Startup.Configuration["JWTkey"].ToString())),
                    SecurityAlgorithms.HmacSha256Signature)
                };
                var jwtSecurityTokenHandler = new JwtSecurityTokenHandler();
                var securityToken = jwtSecurityTokenHandler.CreateToken(securityTokenDescriptor);
                var token = jwtSecurityTokenHandler.WriteToken(securityToken);
                return Ok(new { token });
            }
            else
            {
                return BadRequest(new { message = "Invalid login attempt." });
            }
        }
        #endregion
        //





        //GET: api/Users/GetAuthorizedUserInfo
        /// <summary>
        ///  Show Email User by Key
        /// </summary>
        /// <returns>user email</returns>
        [HttpGet]
        [Authorize]
        [Route("GetAuthorizedUserInfo")]
        public async Task<object> GetAuthorizeUserInfo()
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.Email,
            };
        }

 





        /// <summary>
        /// user model class to view on table
        /// </summary>
        public class UserViewModel
        {
            public string Id { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public string[] Roles { get; set; }
        }



        /// <summary>
        /// Function to show users on table from postgresSql
        /// </summary>
        /// <returns>List of models with parameters</returns>
        //GET: api/Users
        [HttpGet]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<IEnumerable<UserViewModel>>> Users()
        {
            List<UserViewModel> viewModels = new List<UserViewModel>();
            List<Models.User> users = await _context.Users.ToListAsync();
            foreach (Models.User user in users)
            {
                viewModels.Add(new UserViewModel()
                {
                    Id = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber,
                    Roles = _userManager.GetRolesAsync(user).Result.ToArray()

                });
            }
            return viewModels;
        }


        //GET: api/Users/5
        [HttpGet("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<UserViewModel>> GetUser(string id)
        {
            var applicationUser = await _context.Users.FindAsync(id);
            if (applicationUser == null)
            {
                return NotFound();
            }
            UserViewModel userViewModel = new UserViewModel()
            {
                Id = applicationUser.Id,
                Email = applicationUser.Email,
                PhoneNumber = applicationUser.PhoneNumber,
                Roles = _userManager.GetRolesAsync(applicationUser).Result.ToArray()
            };

            return userViewModel;

        }

        //DELETE: api/Users/5
        /// <summary>
        /// Delete the current User by his ID
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpDelete("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<UserViewModel>> DeleteUser(string id)
        {
            var applicationUser = await _context.Users.FindAsync(id);
            if (applicationUser == null)
            {
                return NotFound();
            }
            _context.Users.Remove(applicationUser);
            await _context.SaveChangesAsync();

            return new UserViewModel()
            {
                Id = applicationUser.Id,
                Email = applicationUser.Email,
                PhoneNumber = applicationUser.PhoneNumber,
                Roles = _userManager.GetRolesAsync(applicationUser).Result.ToArray()
            };

        }



        //PUT: api/Users/5
        /// <summary>
        /// Put new model after editing on the new model with this id
        /// </summary>
        /// <param name="id">user id</param>
        /// <param name="model">model of user</param>
        /// <returns>new user model</returns>
        [HttpPut("{id}")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult> PutUser(string id, UserViewModel model)
        {
            if (id != model.Id)
            {
                return BadRequest();
            }
            var applicationUser = await _context.Users.FindAsync(id);
            if (applicationUser == null)
            {
                return NotFound();
            }

            _context.Entry(applicationUser).State = EntityState.Modified;
            try
            {
                 var userRoles = await _userManager.GetRolesAsync(applicationUser);
                 await _userManager.RemoveFromRolesAsync(applicationUser,userRoles.ToArray());
                 await _userManager.AddToRolesAsync(applicationUser,model.Roles);
                 await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if(applicationUser == null){
                    return NotFound();
                }                
                else{
                    throw;
                }
            }
            return NoContent();
        }
        //

        //GET: api/Users/GetRoles
        /// <summary>
        /// 
        /// </summary>
        /// <returns>Roles List</returns>
        [HttpGet]
        [Route("GetRoles")]
        [Authorize(Roles = "Administrator")]
        public async Task<ActionResult<IEnumerable<IdentityRole>>> GetRoles(){
            return await _context.Roles.ToListAsync();
        }
        
    }
}


