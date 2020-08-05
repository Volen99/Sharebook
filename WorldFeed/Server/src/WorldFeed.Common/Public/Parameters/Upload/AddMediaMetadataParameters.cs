namespace WorldFeed.Common.Public.Parameters.Upload
{
    using Newtonsoft.Json;

    using WorldFeed.Common.JsonConverters;
    using WorldFeed.Common.Public.Models.Interfaces.DTO;

    /// <summary>
    /// For more description visit : https://dev.twitter.com/en/docs/media/upload-media/api-reference/post-media-metadata-create
    /// </summary>
    public interface IAddMediaMetadataParameters : IMediaMetadata, ICustomRequestParameters
    {
    }
    
    public class AddMediaMetadataParameters : CustomRequestParameters, IAddMediaMetadataParameters
    {
        public AddMediaMetadataParameters(long? mediaId)
        {
            MediaId = mediaId;
        }
        
        [JsonProperty("media_id")]
        public long? MediaId { get; set; }
        
        [JsonProperty("alt_text")]
        [JsonConverter(typeof(JsonUploadMetadataAltTextConverter))]
        public string AltText { get; set; }
    }
}
