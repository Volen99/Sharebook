﻿namespace WorldFeed.Common.DTO
{
    using System.Collections.Generic;
    using Newtonsoft.Json;

    using WorldFeed.Common.Public.Models.Entities;

    public class ObjectEntitiesDTO : IObjectEntities
    {
        [JsonProperty("urls")]
        public List<IUrlEntity> Urls { get; set; }

        [JsonProperty("user_mentions")]
        public List<IUserMentionEntity> UserMentions { get; set; }

        [JsonProperty("hashtags")]
        public List<IHashtagEntity> Hashtags { get; set; }

        [JsonProperty("symbols")]
        public List<ISymbolEntity> Symbols { get; set; }

        [JsonProperty("media")]
        public List<IMediaEntity> Medias { get; set; }
    }
}
