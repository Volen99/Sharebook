namespace WorldFeed.AspNet.NetCore
{
    using System.Net;
    using Microsoft.AspNetCore.Http;

    using WorldFeed.Common.Public.Models.Webhooks;

    public class WebhookRequestFactory
    {
        public static IWebhooksRequest Create(HttpContext context)
        {
            return new WebhooksRequestForAspNetCore(context);
        }

        public static IWebhooksRequest Create(HttpListenerContext context)
        {
            return new WebhooksRequestForHttpServer(context);
        }
    }
}