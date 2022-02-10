using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Stern_IT.Models
{
    public class Attachment
    {
        public string AttachmentId { get; set; }
        public string AttachmentUrl { get; set; }
        public string AttachmentName { get; set; }
        public  Ticket Ticket { get; set; }
    }
}
