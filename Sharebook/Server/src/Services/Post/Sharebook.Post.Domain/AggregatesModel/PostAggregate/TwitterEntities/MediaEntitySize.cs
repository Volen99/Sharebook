﻿namespace Sharebook.Post.Domain.AggregatesModel.PostAggregate.TwitterEntities
{
    using Newtonsoft.Json;

    using Sharebook.Storage.Domain.AggregatesModel.PostAggregate.Entities;

    /// <summary>
    /// Object storing information related with media size on Twitter
    /// </summary>
    public class MediaEntitySize : IMediaEntitySize
    {
        [JsonProperty("w")]
        public int? Width { get; set; }

        [JsonProperty("h")]
        public int? Height { get; set; }

        [JsonProperty("resize")]
        public string Resize { get; set; }
    }
}