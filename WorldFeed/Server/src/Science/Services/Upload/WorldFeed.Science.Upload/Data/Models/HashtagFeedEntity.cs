﻿namespace WorldFeed.Science.Upload.Data.Models
{
    using WorldFeed.Common.Models;
    using WorldFeed.Common.Models.WorldFeed.Feed.Entities;
    using WorldFeed.Science.API.Data.Models;

    public class HashtagFeedEntity : BaseDeletableModel<long>, IHashtagFeedEntity
    {
        public string Text { get; set; }

        public string Indices { get; set; }

        public long FeedEntitiesId { get; set; }
        public FeedEntities Feed { get; set; }
    }
}
