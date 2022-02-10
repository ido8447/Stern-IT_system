using Azure.Storage.Blobs;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Stern_IT.Blob
{
    public interface IBlobService
    {
        Task<Uri> UploadFileBlobAsync(string blobContainerName, Stream content, string contentType, string fileName);
    }
}