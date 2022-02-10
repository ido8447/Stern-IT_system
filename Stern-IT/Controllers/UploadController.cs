using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.WindowsAzure.Storage;
using Stern_IT.Blob;

namespace Stern_IT.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private IBlobService _blobService;
        private readonly Models.SternItContext _context;

        public UploadController(IBlobService blobService, Models.SternItContext dbContext)
        {
            _blobService = blobService;
            _context = dbContext;

        }

        [HttpPost(""), DisableRequestSizeLimit]
        public async Task<ActionResult> UploadProfilePicture()
        {
            IFormFile file = Request.Form.Files[0];
            if (file == null)
            {
                return BadRequest();
            }
            var name = file.FileName.Split(".");
            var result = await _blobService.UploadFileBlobAsync(
                    "firstcontainer",
                    file.OpenReadStream(),
                    file.ContentType,
                   name[0] + "_" + DateTime.Now.Millisecond + "." + name[1]);

            var toReturn = result.AbsoluteUri;

            return Ok(new { path = toReturn });
        }




    }
}
