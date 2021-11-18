using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
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

        /// <summary>
        /// Function to Register
        /// </summary>
        public class UserRegisterModel
        {
            [Required]
            [EmailAddress]
            public string Email { get; set; }


            [Required]
            [StringLength(100, ErrorMessage ="The {0} Must be least {2} and the maz {1} charaters long", MinimumLength =4)]
            [DataType(DataType.Password)]
            public string Password { get; set; }
        }

        //POST: api/Users/Register
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

    }
}
