﻿namespace WorldFeed.Common.Models.TwitterEntities.ExtendedEntities
{
    using Newtonsoft.Json;

    using WorldFeed.Common.Public.Models.Entities.ExtendedEntities;

    public class VideoEntityVariant : IVideoEntityVariant
    {
        [JsonProperty("bitrate")]
        public int Bitrate { get; set; }

        [JsonProperty("content_type")]
        public string ContentType { get; set; }

        [JsonProperty("url")]
        public string URL { get; set; }
    }
}