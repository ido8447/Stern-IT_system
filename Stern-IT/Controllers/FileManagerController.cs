using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;

namespace Stern_IT.Controllers
{

    [Route("api/[controller]")]
    [ApiController]
    public class FileManagerController : ControllerBase
    {
        private readonly Models.SternItContext _context;
        private readonly string AppDirectory = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");


        // public async Task<object> UploadFile(FileRecord fileRecord)

        [HttpPost("UploadFile")]
        public async Task<object> UploadFile(string fileRecord)
        {
            var path = Path.Combine(AppDirectory, fileRecord);

            FileRecord file = new FileRecord(){
                FileName = fileRecord,
                FilePath = path,
                Id = 4
            };
            try
            {
                _context.Add(file);
                var result = await _context.SaveChangesAsync();
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public class FileRecord
        {
            public int Id { get; set; }
            public string FileName { get; set; }
            public string FilePath { get; set; }
        }


    }

}