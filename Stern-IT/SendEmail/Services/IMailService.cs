using System.Threading.Tasks;

namespace Stern_IT.SendEmail.Services
{
    public interface IMailService
    {
        Task SendEmailAsync(MailRequest mailRequest);
    }
}
