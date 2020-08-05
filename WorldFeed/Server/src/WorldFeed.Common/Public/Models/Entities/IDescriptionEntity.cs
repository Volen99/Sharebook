﻿namespace WorldFeed.Common.Public.Models.Entities
{
    using System.Collections.Generic;

    public interface IDescriptionEntity
    {
        /// <summary>
        /// URLs found in a description.
        /// </summary>
        IEnumerable<IUrlEntity> Urls { get; set; }
    }
}