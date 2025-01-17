﻿import {ITweetIdentifier} from "./tweet-identifier";
import {IUser} from "../../../core/interfaces/common/users";
import {ITweetEntities} from "../../post-object/Entities/interfaces/ITweetEntities";
import {ITweetDTO} from "./DTO/tweet-dto";
import {IMediaEntity} from "../../post-object/Entities/interfaces/IMediaEntity";
import {IPoll} from "./poll/poll";

// ... Well a Post :-) https://dev.twitter.com/docs/platform-objects/tweets
export interface IPost extends ITweetIdentifier {
  // #region Twitter API Properties

  // UTC time when this Post was created
  createdAt: Date; // DateTimeOffset;

  // Formatted text of the post.
  status: string;

  // Prefix of an extended post.
  prefix: string;

  // Suffix of an extended post.
  suffix: string;

  // Full text of an extended post.
  fullText: string;

  // Content display text range for FullText.
  displayTextRange: number[];

  /// <summary>
  /// The range of text to be displayed for any Post.
  /// If this is an Extended Tweet, this will be the range supplied by Twitter.
  /// If this is an old-style 140 character Tweet, the range will be 0 - Length.
  /// </summary>
  safeDisplayTextRange: number[];

  // Utility used to post the Tweet, as an HTML-formatted string. Tweets from the Twitter website have a source value of web
  source: string;

  // Whether the tweet text was truncated because it was longer than 140 characters.
  truncated: boolean;

  // Number of times this Tweet has been replied to
  // This property is only available with the Premium and Enterprise tier products.
  replyCount?: number;

  // If the represented Tweet is a reply, this field will contain the integer representation of the original ID
  inReplyToStatusId?: number;

  // In_reply_to_status_id_str
  inReplyToStatusIdStr: string;

  // If the represented Tweet is a reply, it will contain the integer representation of the original author ID
  inReplyToUserId?: number;

  user: IUser;

  // In_reply_to_user_id_str
  inReplyToUserIdStr: string;

  // If the represented Tweet is a reply, it will contain the screen name of the original Tweet’s author
  inReplyToScreenName: string;

  // User who created the Tweet
  createdBy: IUser;

  // Details the Tweet ID of the users's own retweet (if existent) of this Tweet.
  currentUserRetweetIdentifier: ITweetIdentifier;

  // Ids of the users who contributed in the Tweet
  contributorsIds: number[];

  // Users who contributed to the authorship of the tweet, on behalf of the official tweet author.
  contributors: Iterable<number>;

  // Number of retweets related with this tweet
  retweetCount: number;

  // Extended entities in the tweet. Used by twitter for multiple photos
  entities: ITweetEntities;

  // Is the tweet Favorited
  favorited: boolean;

  // Number of time the tweet has been Favorited
  favoriteCount: number;

  dislikeCount: number;

  // Has the tweet been retweeted
  retweeted: boolean;

  // Is the tweet potentialy sensitive
  possiblySensitive: boolean;

  // Main language used in the tweet
  language?: any; // Language;

  // Informed whether a tweet is displayed or not in a specific type of scope. This property is most of the time null.
  scopes: Map<string, object>;

  // Streaming tweets requires a filter level. A tweet will be streamed if its filter level is higher than the one of the stream
  filterLevel: string;

  // Informs that a tweet has been withheld for a copyright reason
  withheldCopyright: boolean;

  // Countries in which the tweet will be withheld
  withheldInCountries: Iterable<string>;

  // When present, indicates whether the content being withheld is the "status" or a "users."
  withheldScope: string;

  // #endregion

  // #region Tweetinvi API Properties

  // Property used to -+store the data received from Twitter
    tweetDTO: ITweetDTO;
  //
  // // Collection of hashtags associated with a Tweet
  // hashtags: Array<IHashtagEntity>;
  //
  // // Collection of urls associated with a tweet
  // urls: Array<IUrlEntity>;
  //
  // Collection of medias associated with a tweet
  media: Array<IMediaEntity>;
  //
  // // Collection of tweets mentioning this tweet
  // userMentions: Array<IUserMentionEntity>;

  poll: IPoll;

  // Indicates whether the current tweet is a retweet of another tweet
  isRetweet: boolean;

  // If the tweet is a retweet this field provides the tweet that it retweeted
  retweetedTweet: IPost;

  // Indicates approximately how many times this Tweet has been quoted by Twitter users.
  // This property is only available with the Premium and Enterprise tier products.
  quoteCount?: number;

  // Tweet Id that was retweeted with a quote
  quotedStatusId?: number;

  // Tweet Id that was retweeted with a quote
  quotedStatusIdStr: string;

  // Tweet that was retweeted with a quote
  quotedTweet: IPost;

  // URL of the tweet on twitter.com
  url: string;

  // tweetMode: TweetMode;

  // #endregion

  blacklisted?: boolean;
  blacklistedReason?: string;
  tags: string[];

  // #region Favorites

  // Favorites the tweet
  favoriteAsync(): Promise<void>;

  // Remove the tweet from favorites
  unfavoriteAsync(): Promise<void>;

  // #endregion

  // Retweet the current tweet from the authenticated users.
  publishRetweetAsync(): Promise<IPost>;

  // Get the retweets of the current tweet
  getRetweetsAsync(): Promise<IPost[]>;

  // Remove your retweet.
  destroyRetweetAsync(): Promise<void>;

  // Delete a tweet from Twitter
  destroyAsync(): Promise<void>;

}
