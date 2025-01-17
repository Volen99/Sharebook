﻿using System.Threading.Tasks;

using Chessbook.Core.Domain.Common;
using Chessbook.Services.Caching;

namespace Chessbook.Services.Common.Caching
{
    /// <summary>
    /// Represents a generic attribute cache event consumer
    /// </summary>
    public partial class GenericAttributeCacheEventConsumer : CacheEventConsumer<GenericAttribute>
    {
        /// <summary>
        /// Clear cache data
        /// </summary>
        /// <param name="entity">Entity</param>
        /// <returns>A task that represents the asynchronous operation</returns>
        protected override async Task ClearCacheAsync(GenericAttribute entity)
        {
            await RemoveAsync(CBCommonDefaults.GenericAttributeCacheKey, entity.EntityId, entity.KeyGroup);
        }
    }
}
