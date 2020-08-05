﻿namespace WorldFeed.Controllers.Messages
{
    using System.Threading.Tasks;

    using WorldFeed.Common.Iterators;
    using WorldFeed.Common.Public;
    using WorldFeed.Common.Public.Models.Interfaces;
    using WorldFeed.Common.Public.Models.Interfaces.DTO;
    using WorldFeed.Common.Public.Models.Interfaces.DTO.QueryDTO;
    using WorldFeed.Common.Public.Parameters.MessageClient;
    using WorldFeed.Common.Web;
    using WorldFeed.Core.Controllers;


    public class MessageController : IMessageController
    {
        private readonly IMessageQueryExecutor messageQueryExecutor;

        public MessageController(IMessageQueryExecutor messageQueryExecutor)
        {
            this.messageQueryExecutor = messageQueryExecutor;
        }

        public Task<ITwitterResult<ICreateMessageDTO>> PublishMessageAsync(IPublishMessageParameters parameters, ITwitterRequest request)
        {
            return this.messageQueryExecutor.PublishMessageAsync(parameters, request);
        }

        public Task<ITwitterResult> DestroyMessageAsync(IDeleteMessageParameters parameters, ITwitterRequest request)
        {
            return this.messageQueryExecutor.DestroyMessageAsync(parameters, request);
        }

        public Task<ITwitterResult<IGetMessageDTO>> GetMessageAsync(IGetMessageParameters parameters, ITwitterRequest request)
        {
            return this.messageQueryExecutor.GetMessageAsync(parameters, request);
        }

        public ITwitterPageIterator<ITwitterResult<IMessageCursorQueryResultDTO>> GetMessagesIterator(IGetMessagesParameters parameters, ITwitterRequest request)
        {
            return new TwitterPageIterator<ITwitterResult<IMessageCursorQueryResultDTO>>(parameters.Cursor, cursor =>
                {
                    var cursoredParameters = new GetMessagesParameters(parameters)
                    {
                        Cursor = cursor
                    };

                    return this.messageQueryExecutor.GetMessagesAsync(cursoredParameters, new TwitterRequest(request));
                },
                page => page.Model.NextCursorStr,
                page =>
                {
                    return page.Model.NextCursorStr == "0" || string.IsNullOrEmpty(page.Model.NextCursorStr);
                });
        }
    }
}
