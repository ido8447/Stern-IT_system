using System.ComponentModel.DataAnnotations;

namespace Stern_IT.Models
{
    public class Attathment
    {
        [Key]
        public int AttachmentID { get; set; }
        public Ticket ticket { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; }
    }
}
