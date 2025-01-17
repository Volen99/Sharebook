﻿import {ITweetEntities} from "./interfaces/ITweetEntities";
import {ITweetDTO} from "../../posts/models/DTO/tweet-dto";
import {IUrlEntity} from "./interfaces/IUrlEntity";
import {IUserMentionEntity} from "./interfaces/IUserMentionEntity";
import {IHashtagEntity} from "./interfaces/IHashTagEntity";
import {ISymbolEntity} from "./interfaces/ISymbolEntity";
import {IMediaEntity} from "./interfaces/IMediaEntity";

export class TweetEntities implements ITweetEntities {
  private readonly _tweetDTO: ITweetDTO;

  constructor(tweetDTO: ITweetDTO) {
    this._tweetDTO = tweetDTO;

    this.InitializeEntities();
  }

  public urls: Array<IUrlEntity>;
  public userMentions: Array<IUserMentionEntity>;
  public hashtags: Array<IHashtagEntity>;
  public symbols: Array<ISymbolEntity>;
  public medias: Array<IMediaEntity>;

  private InitializeEntities(/*tweetMode: TweetMode*/): void {
    // NOTE: The STREAMING API and REST API does not provide the same JSON structure based on the TweetMode used.
    //
    // * STREAMING API : Adds a new ExtendedTweet regardless of the TweetMode. To have some consistency with the REST API,
    //   we decided that in COMPAT mode, the Entities will be restricted to what is available in the REST API.
    // * REST API : Adds FullText and additional properties if the TweetMode is extended.

    let isTweetComingFromStreamingAPI = true; // this._tweetDTO?.extendedTweet != null;
    let useStreamingApiExtendedTweetForEntities = true; // tweetMode === TweetMode.Extended && isTweetComingFromStreamingAPI;

    // Get the entities and extended_entities for whichever Tweet DTO we're using
    let entities = this._tweetDTO.entities; //  useStreamingApiExtendedTweetForEntities ? this._tweetDTO.extendedTweet.legacyEntities : this._tweetDTO?.legacyEntities;
    let extendedEntities = this._tweetDTO.entities;  // useStreamingApiExtendedTweetForEntities ? this._tweetDTO.extendedTweet.extendedEntities : this._tweetDTO?.entities;

    // Populate for each type of entity.

    this.urls = entities?.urls;
    this.userMentions = entities?.userMentions;
    this.hashtags = entities?.hashtags;
    this.symbols = entities?.symbols;

    // Media can also be in the extended_entities field. https://dev.twitter.com/overview/api/entities-in-twitter-objects#extended_entities
    // If that's populated, we must use it instead or risk missing media
    this.medias = extendedEntities?.medias ?? entities?.medias ?? new Array<IMediaEntity>();

    // If this is a retweet, it's also now possible for an entity to get cut off of the end of the tweet entirely.
    // If the same Tweet is fetched over the REST API, these entities get excluded, so lets do the same.
    if (this._tweetDTO?.retweetedTweetDTO != null) {
      this.urls = this.urls?.filter(e => e.indices[0] !== e.indices[1]);
      this.userMentions = this.userMentions?.filter(e => e.indices[0] !== e.indices[1]);
      this.hashtags = this.hashtags?.filter(e => e.indices[0] !== e.indices[1]);
      this.symbols = this.symbols?.filter(e => e.indices[0] !== e.indices[1]);
      this.medias = this.medias?.filter(e => e.indices[0] !== e.indices[1]);
    }
  }
}
