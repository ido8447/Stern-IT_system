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
        private readonly Models.DbContext _context;

        //constractor
        public UsersController(UserManager<Models.User> userManager, Models.DbContext dbContext)
        {
            _userManager = userManager;
            _context = dbContext;
        }
        //
        #region Register

        /// <summary>
        /// Class to Register
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
        /// Function to Register
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
        /// Class to Login
        /// </summary>
        public class UserLoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }

        //POST: api/Users/Login
        /// <summary>
        /// Function to Login
        /// </summary>
        [HttpPost]
        [Route("Login")]
        public async Task<IActionResult> Login(UserLoginModel model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                //
                List<Claim> claims = new List<Claim>();
                claims.Add(new Claim("Id", user.Id.ToString()));
                claims.Add(new Claim("Email", user.Email));
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
        /// <returns></returns>
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
        /// user view model class
        /// </summary>
        public class UserViewModel
        {
            public string Id { get; set; }
            public string Email { get; set; }
            public string PhoneNumber { get; set; }
            public string[] Roles { get; set; }
        }



        //todo write on this
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
    }
}
