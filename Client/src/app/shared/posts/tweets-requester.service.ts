﻿import {Injectable} from "@angular/core";

import {IGetTweetParameters} from "./parameters/get-tweet-parameters";
import {IGetTweetsParameters} from "./parameters/get-tweets-parameters";
import {IPublishTweetParameters} from "./parameters/publish-tweet-parameters";
import {IDestroyTweetParameters} from "./parameters/destroy-tweet-parameters";
import {IGetRetweetsParameters} from "./parameters/get-retweets-parameters";
import {IPublishRetweetParameters} from "./parameters/publish-retweet-parameters";
import {IDestroyRetweetParameters} from "./parameters/destroy-retweet-parameters";
import {IGetRetweeterIdsParameters} from "./parameters/get-retweeter-ids-parameters";
import {IGetUserFavoriteTweetsParameters} from "./parameters/get-favorite-tweets-Parameters";
import {IFavoriteTweetParameters} from "./parameters/favorite-tweet-parameters";
import {IUnfavoriteTweetParameters} from "./parameters/unfavorite-tweet-parameters";
import {IGetOEmbedTweetParameters} from "./parameters/get-OEmbed-tweet-parameters";
import {ITweetDTO} from "./models/DTO/tweet-dto";
import {ITweetsClientRequiredParametersValidator} from "./validators/tweets-client-required-parameters-validator";
import {TweetControllerService} from "./tweet-controller.service";

@Injectable()
export class TweetsRequesterService {
  private readonly _tweetsClientRequiredParametersValidator: ITweetsClientRequiredParametersValidator;

  constructor(private tweetControllerService: TweetControllerService) {
  }

  // // Tweets
  // public getTweetAsync(parameters: IGetTweetParameters): Promise<ITweetDTO> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   this._tweetController.getTweetAsync(parameters);
  // }
  //
  // public getTweetsAsync(parameters: IGetTweetsParameters): Promise<ITweetDTO[]> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   return super.executeRequestAsync(request => this._tweetController.getTweetsAsync(parameters, request));
  // }

  // Tweets - Publish
  public publishTweetAsync(parameters: IPublishTweetParameters): Promise<ITweetDTO> {
    // this._tweetsClientRequiredParametersValidator.validate(parameters);

    return this.tweetControllerService.publishTweetAsync(parameters);
  }

  // Tweets - Destroy
  public destroyTweetAsync(parameters: IDestroyTweetParameters, unshare = false): Promise<ITweetDTO> {
    // this._tweetsClientRequiredParametersValidator.validate(parameters);

    return this.tweetControllerService.destroyTweetAsync(parameters, unshare);
  }
  //
  // // Retweets
  // public getRetweetsAsync(parameters: IGetRetweetsParameters): Promise<ITweetDTO[]> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   return super.executeRequestAsync(request => this._tweetController.getRetweetsAsync(parameters, request));
  // }
  //
  // Retweets - Publish
  public publishRetweetAsync(parameters: IPublishRetweetParameters): Promise<ITweetDTO> {
    // this._tweetsClientRequiredParametersValidator.validate(parameters);

    return this.tweetControllerService.publishRetweetAsync(parameters);
  }
  //
  // // Retweets - Destroy
  // public destroyRetweetAsync(parameters: IDestroyRetweetParameters): Promise<ITweetDTO> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   return super.executeRequestAsync(request => this._tweetController.destroyRetweetAsync(parameters, request));
  // }
  //
  // public getRetweeterIdsIterator(parameters: IGetRetweeterIdsParameters): ITwitterPageIterator<ITwitterResult<IIdsCursorQueryResultDTO>> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   let request: ITwitterRequest = super.TwitterClient.createRequest();
  //   request.executionContext.converters = JsonQueryConverterRepository.Converters;
  //   return this._tweetController.getRetweeterIdsIterator(parameters, request);
  // }
  //
  // public getUserFavoriteTweetsIterator(parameters: IGetUserFavoriteTweetsParameters): ITwitterPageIterator<ITwitterResult<ITweetDTO[]>, number> // long?
  // {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   let request: ITwitterRequest = super.TwitterClient.createRequest();
  //   return this._tweetController.getFavoriteTweetsIterator(parameters, request);
  // }
  //
  // public favoriteTweetAsync(parameters: IFavoriteTweetParameters): Promise<ITweetDTO> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //
  //   return this.tweetControllerService.favoriteTweetAsync(parameters);
  // }
  //
  // public unfavoriteTweetAsync(parameters: IUnfavoriteTweetParameters): Promise<ITweetDTO> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   return super.executeRequestAsync(request => this._tweetController.unfavoriteTweetAsync(parameters, request));
  // }
  //
  // public getOEmbedTweetAsync(parameters: IGetOEmbedTweetParameters): Promise<IOEmbedTweetDTO> {
  //   this._tweetsClientRequiredParametersValidator.validate(parameters);
  //   return super.executeRequestAsync(request => this._tweetController.getOEmbedTweetAsync(parameters, request));
  // }
}