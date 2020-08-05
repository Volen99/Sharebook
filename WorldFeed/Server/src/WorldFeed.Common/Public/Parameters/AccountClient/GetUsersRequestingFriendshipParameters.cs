namespace WorldFeed.Common.Public.Parameters.AccountClient
{
    using WorldFeed.Common.Public.Parameters.Optionals;
    using WorldFeed.Common.Settings;

    /// <summary>
    /// For more information visit : https://developer.twitter.com/en/docs/accounts-and-users/follow-search-get-users/api-reference/get-friendships-incoming
    /// </summary>
    /// <inheritdoc />
    public interface IGetUsersRequestingFriendshipParameters : IGetCursorUsersOptionalParameters, IGetUserIdsRequestingFriendshipParameters
    {
        /// <summary>
        /// Page size when retrieving the users objects from Twitter
        /// </summary>
        int GetUsersPageSize { get; set; }
    }

    /// <inheritdoc />
    public class GetUsersRequestingFriendshipParameters : GetCursorUsersOptionalParameters, IGetUsersRequestingFriendshipParameters
    {
        public GetUsersRequestingFriendshipParameters()
        {
            GetUsersPageSize = WorldFeedLimits.DEFAULTS.USERS_GET_USERS_MAX_SIZE;
        }

        public GetUsersRequestingFriendshipParameters(IGetUsersRequestingFriendshipParameters source) : base(source)
        {
            if (source == null)
            {
                GetUsersPageSize = WorldFeedLimits.DEFAULTS.USERS_GET_USERS_MAX_SIZE;
                return;
            }

            GetUsersPageSize = source.GetUsersPageSize;
        }

        /// <inheritdoc/>
        public int GetUsersPageSize { get; set; }
    }
}
