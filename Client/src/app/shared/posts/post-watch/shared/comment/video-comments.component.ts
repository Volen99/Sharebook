import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Subject, Subscription} from 'rxjs';

import {PostDetails} from "../../../../shared-main/post/post-details.model";
import {User} from "../../../../shared-main/user/user.model";
import {PostComment} from "../../../../shared-post-comment/post-comment-model";
import {ComponentPagination, hasMoreItems} from "../../../../../core/rest/component-pagination.model";
import {PostCommentThreadTree} from "../../../../shared-post-comment/video-comment-thread-tree.model";
import {UserStore} from "../../../../../core/stores/user.store";
import {NbToastrService} from "../../../../../sharebook-nebular/theme/components/toastr/toastr.service";
import {ConfirmService} from "../../../../../core/confirm/confirm.service";
import {VideoCommentService} from "../../../../shared-post-comment/video-comment.service";

@Component({
  selector: 'my-video-comments',
  templateUrl: './video-comments.component.html',
  styleUrls: ['./video-comments.component.scss']
})
export class VideoCommentsComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('commentHighlightBlock') commentHighlightBlock: ElementRef;
  @Input() video: PostDetails;
  @Input() user: User;

  @Output() timestampClicked = new EventEmitter<number>();

  comments: PostComment[] = [];
  highlightedThread: PostComment;

  sort = '-createdAt';

  componentPagination: ComponentPagination = {
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: null
  };
  totalNotDeletedComments: number;

  inReplyToCommentId: number;
  commentReplyRedraftValue: string;
  commentThreadRedraftValue: string;

  threadComments: { [id: number]: PostCommentThreadTree } = {};
  threadLoading: { [id: number]: boolean } = {};

  onDataSubject = new Subject<any[]>();

  private sub: Subscription;

  constructor(
    private userStore: UserStore,
    private notifier: NbToastrService,
    private confirmService: ConfirmService,
    private videoCommentService: VideoCommentService,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['video']) {
      this.resetVideo();
    }
  }

  ngOnInit() {
    // Find highlighted comment in params
    this.sub = this.activatedRoute.params.subscribe(
      params => {
        if (params['threadId']) {
          const highlightedThreadId = +params['threadId'];
          this.processHighlightedThread(highlightedThreadId);
        }
      }
    );
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }

  viewReplies(commentId: number, highlightThread = false) {
    this.threadLoading[commentId] = true;

    const params = {
      videoId: this.video.id,
      threadId: commentId
    };

    this.videoCommentService.getVideoThreadComments(params).subscribe(
      res => {
        this.threadComments[commentId] = res;
        this.threadLoading[commentId] = false;

        if (highlightThread) {
          this.highlightedThread = new PostComment(res.comment);

          // Scroll to the highlighted thread
          setTimeout(() => this.commentHighlightBlock.nativeElement.scrollIntoView(), 0);
        }

      },

      err => this.notifier.danger(err.message, 'Error in this.videoCommentService.getVideoThreadComments(params).subscribe')
    );
  }

  loadMoreThreads() {
    const params = {
      videoId: this.video.id,
      componentPagination: this.componentPagination,
      sort: this.sort
    };

    this.videoCommentService.getVideoCommentThreads(params).subscribe(
      res => {
        this.comments = this.comments.concat(res.data);
        this.componentPagination.totalItems = res.total;
        this.totalNotDeletedComments = res.totalNotDeletedComments;

        this.onDataSubject.next(res.data);
        // this.hooks.runAction('action:video-watch.video-threads.loaded', 'video-watch', {data: this.componentPagination});
      },

      err => this.notifier.danger(err.message, 'Error')
    );
  }

  onCommentThreadCreated(comment: PostComment) {
    this.comments.unshift(comment);
    this.commentThreadRedraftValue = undefined;
  }

  onWantedToReply(comment: PostComment) {
    this.inReplyToCommentId = comment.id;
  }

  onResetReply() {
    this.inReplyToCommentId = undefined;
    this.commentReplyRedraftValue = undefined;
  }

  onThreadCreated(commentTree: PostCommentThreadTree) {
    this.viewReplies(commentTree.comment.id);
  }

  handleSortChange(sort: string) {
    if (this.sort === sort) return;

    this.sort = sort;
    this.resetVideo();
  }

  handleTimestampClicked(timestamp: number) {
    this.timestampClicked.emit(timestamp);
  }

  async onWantedToDelete(
    commentToDelete: PostComment,
    title = `Delete`,
    message = `Do you really want to delete this comment?`
  ): Promise<boolean> {
    if (commentToDelete.isLocal || true) { // this.video.isLocal
      message += ` The deletion will be sent to remote instances so they can reflect the change.`;
    } else {
      message += ` It is a remote comment, so the deletion will only be effective on your instance.`;
    }

    // const res = await this.confirmService.confirm(message, title);
    // if (res === false) {
    //   return false;
    // }

    this.videoCommentService.deleteVideoComment(commentToDelete.postId, commentToDelete.id)
      .subscribe(
        () => {
          if (this.highlightedThread?.id === commentToDelete.id) {
            commentToDelete = this.comments.find(c => c.id === commentToDelete.id);

            this.highlightedThread = undefined;
          }

          // Mark the comment as deleted
          this.softDeleteComment(commentToDelete);
        },

        err => this.notifier.danger(err.message, 'Error')
      );

    return true;
  }

  async onWantedToRedraft(commentToRedraft: PostComment) {
    // const confirm = await this.onWantedToDelete(commentToRedraft, `Delete and re-draft`, `Do you really want to delete and re-draft this comment?`);

    if (true) { // confirm
      this.inReplyToCommentId = commentToRedraft.inReplyToCommentId;

      // Restore line feed for editing
      const commentToRedraftText = commentToRedraft.text.replace(/<br.?\/?>/g, '\r\n');

      if (commentToRedraft.threadId === commentToRedraft.id) {
        this.commentThreadRedraftValue = commentToRedraftText;
      } else {
        this.commentReplyRedraftValue = commentToRedraftText;
      }

    }
  }

  isUserLoggedIn() {
    return this.userStore.isLoggedIn();
  }

  onNearOfBottom() {
    if (hasMoreItems(this.componentPagination)) {
      this.componentPagination.currentPage++;
      this.loadMoreThreads();
    }
  }

  private softDeleteComment(comment: PostComment) {
    comment.isDeleted = true;
    comment.deletedAt = new Date();
    comment.text = '';
    comment.account = null;
  }

  private resetVideo() {
    if (this.video.commentsEnabled === true) {
      // Reset all our fields
      this.highlightedThread = null;
      this.comments = [];
      this.threadComments = {};
      this.threadLoading = {};
      this.inReplyToCommentId = undefined;
      this.componentPagination.currentPage = 1;
      this.componentPagination.totalItems = null;
      this.totalNotDeletedComments = null;

      // this.syndicationItems = this.videoCommentService.getVideoCommentsFeeds(this.video);
      this.loadMoreThreads();
    }
  }

  private processHighlightedThread(highlightedThreadId: number) {
    this.highlightedThread = this.comments.find(c => c.id === highlightedThreadId);

    const highlightThread = true;
    this.viewReplies(highlightedThreadId, highlightThread);
  }
}
