﻿import {ITwitterResult} from "../../core/Core/Web/TwitterResult";
import {ITwitterRequest} from "../../core/Public/Models/Interfaces/ITwitterRequest";
import {TwitterRequest} from "../../core/Public/TwitterRequest";
import {ITwitterAccessor} from "../../core/Core/Web/ITwitterAccessor";
import {HttpMethod} from 'src/app/core/Public/Models/Enum/HttpMethod';
import {IPublishMessageParameters} from "../../core/Public/Parameters/MessageClient/PublishMessageParameters";
import {IDeleteMessageParameters} from "../../core/Public/Parameters/MessageClient/DestroyMessageParameters";
import {IGetMessageParameters} from "../../core/Public/Parameters/MessageClient/GetMessageParameters";
import {IGetMessagesParameters} from "../../core/Public/Parameters/MessageClient/GetMessagesParameters";
import {IGetMessageDTO} from "../../core/Public/Models/Interfaces/DTO/IGetMessageDTO";
import {IMessageCursorQueryResultDTO} from "../../core/Public/Models/Interfaces/DTO/QueryDTO/IMessageCursorQueryResultDTO";
import {ICreateMessageDTO} from "../../core/Public/Models/Interfaces/DTO/ICreateMessageDTO";
import {IMessageQueryGenerator} from "./MessageQueryGenerator";

export interface IMessageQueryExecutor {
  // Publish Message
  publishMessageAsync(parameters: IPublishMessageParameters, request: ITwitterRequest): Promise<ITwitterResult<ICreateMessageDTO>>;

  destroyMessageAsync(parameters: IDeleteMessageParameters, request: ITwitterRequest): Promise<ITwitterResult>;

  getMessageAsync(parameters: IGetMessageParameters, request: ITwitterRequest): Promise<ITwitterResult<IGetMessageDTO>>;

  getMessagesAsync(parameters: IGetMessagesParameters, request: TwitterRequest): Promise<ITwitterResult<IMessageCursorQueryResultDTO>>;
}

export class MessageQueryExecutor implements IMessageQueryExecutor {
  private readonly _twitterAccessor: ITwitterAccessor;
  private readonly _messageQueryGenerator: IMessageQueryGenerator;

  constructor(twitterAccessor: ITwitterAccessor, messageQueryGenerator: IMessageQueryGenerator) {
    this._twitterAccessor = twitterAccessor;
    this._messageQueryGenerator = messageQueryGenerator;
  }

  public publishMessageAsync(parameters: IPublishMessageParameters, request: ITwitterRequest): Promise<ITwitterResult<ICreateMessageDTO>> {
    let requestWithPayload = this._messageQueryGenerator.getPublishMessageQuery(parameters);

    request.query.url = requestWithPayload.url;
    request.query.httpMethod = HttpMethod.POST;
    request.query.httpContent = requestWithPayload.content;

    return this._twitterAccessor.executeRequestAsync<ICreateMessageDTO>(request);
  }

  public destroyMessageAsync(parameters: IDeleteMessageParameters, request: ITwitterRequest): Promise<ITwitterResult> {
    request.query.url = this._messageQueryGenerator.getDestroyMessageQuery(parameters);
    request.query.httpMethod = HttpMethod.DELETE;
    return this._twitterAccessor.executeRequestAsync(request);
  }

  public getMessageAsync(parameters: IGetMessageParameters, request: ITwitterRequest): Promise<ITwitterResult<IGetMessageDTO>> {
    request.query.url = this._messageQueryGenerator.getMessageQuery(parameters);
    request.query.httpMethod = HttpMethod.GET;
    return this._twitterAccessor.executeRequestAsync<IGetMessageDTO>(request);
  }

  public getMessagesAsync(parameters: IGetMessagesParameters, request: TwitterRequest): Promise<ITwitterResult<IMessageCursorQueryResultDTO>> {
    request.query.url = this._messageQueryGenerator.getMessagesQuery(parameters);
    request.query.httpMethod = HttpMethod.GET;
    return this._twitterAccessor.executeRequestAsync<IMessageCursorQueryResultDTO>(request);
  }
}
