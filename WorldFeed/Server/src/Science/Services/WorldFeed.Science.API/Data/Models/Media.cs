﻿namespace WorldFeed.Science.API.Data.Models
{
    using WorldFeed.Common.Models;

    public class Media : BaseDeletableModel<int>, IAuditInfo
    {
        public long Size { get; set; }

        public string Directory { get; set; }

        public string Path { get; set; }

        public string FileExtension { get; set; }

        public int? Width { get; set; }

        public int? Height { get; set; }

        public int PostId { get; set; }
        public Post Post { get; set; }
    }
}