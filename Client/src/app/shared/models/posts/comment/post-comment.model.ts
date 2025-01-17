import {IUser} from "../../../../core/interfaces/common/users";

export interface IPostComment {
  id: number;
  url: string;
  text: string;
  threadId: number;
  inReplyToCommentId: number;
  postId: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  deletedAt: Date | string;
  isDeleted: boolean;
  totalRepliesFromPostAuthor: number;
  totalReplies: number;
  account: IUser;
}

export interface IPostCommentAdmin {
  id: number;
  url: string;
  text: string;

  threadId: number;
  inReplyToCommentId: number;

  createdAt: Date | string;
  updatedAt: Date | string;

  account: IUser;

  video: {
    id: number
    uuid: string
    name: string
  };
}

export interface IPostCommentThreadTree {
  comment: IPostComment;
  children: IPostCommentThreadTree[];
}

export interface IPostCommentCreate {
  text: string;
}
