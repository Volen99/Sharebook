﻿namespace WorldFeed.Credentials.AuthHttpHandlers
{
    using System.Net.Http;
    using System.Text;
    using System.Threading;
    using System.Threading.Tasks;

    using WorldFeed.Common.Public.Models.Interfaces;
    using WorldFeed.Common.Web;
    using WorldFeed.WebLogic;

    public class InvalidateTokenHttpHandler : TwitterClientHandler
    {
        public InvalidateTokenHttpHandler(IOAuthWebRequestGenerator oAuthWebRequestGenerator) 
            : base(oAuthWebRequestGenerator)
        {
        }

        protected override Task<HttpResponseMessage> SendAsync(ITwitterQuery twitterQuery, HttpRequestMessage request, CancellationToken cancellationToken)
        {
            var credentials = twitterQuery.TwitterCredentials;
            var accessToken = credentials.AccessToken ?? credentials.BearerToken;
            request.Content = new StringContent("access_token=" + accessToken, Encoding.UTF8, "application/x-www-form-urlencoded");

            if (credentials.AccessToken != null)
            {
                return base.SendAsync(twitterQuery, request, cancellationToken);
            }

            var authorizationHeader = BearerHttpHandler.GetBearerTokenAuthorizationHeader(credentials);
            return base.SendAsync(request, cancellationToken, authorizationHeader);
        }
    }
}
