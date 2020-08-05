﻿namespace WorldFeed.Common.Upload
{
    using System.Collections.Generic;
    using System.Threading.Tasks;

    using WorldFeed.Common.Public.Models.Interfaces;
    using WorldFeed.Common.Public.Parameters;

    public interface IChunkedUploader
    {
        long? MediaId { get; set; }

        int NextSegmentIndex { get; set; }

        Dictionary<long, byte[]> UploadedSegments { get; }

        IChunkUploadResult Result { get; }

        Task<bool> InitAsync(IChunkUploadInitParameters initParameters, ITwitterRequest request);
        Task<bool> AppendAsync(IChunkUploadAppendParameters parameters, ITwitterRequest request);
        Task<bool> FinalizeAsync(ICustomRequestParameters customRequestParameters, ITwitterRequest request);
    }
}
