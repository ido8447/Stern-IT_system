using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
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

        public UsersController(UserManager<Models.User> userManager)
        {
            _userManager = userManager;
        }
        #region Register

        /// <summary>
        /// Class to Register
        /// </summary>
        public class UserRegisterModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }


            [Required]
            [StringLength(100, ErrorMessage = "The {0} Must be least {2} and the maz {1} charaters long", MinimumLength = 4)]
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
                Email = model.Email

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
                var securityTokenDescriptor = new SecurityTokenDescriptor
                {
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                    new Claim("Id", user.Id.ToString()),
                    new Claim("Email", user.Email)
                    }),
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


        //GET: api/Users/GetAuthorizedUserInfo
        [HttpGet]
        [Authorize]
        [Route("GetAuthorizedUserInfo")]
        public async Task<object> GetAuthorizeUserInfo()
        {
            string userId = User.Claims.First(c => c.Type == "Id").Value;
            var user = await _userManager.FindByIdAsync(userId);
            return new
            {
                user.Email
            };
        }
    }
}
