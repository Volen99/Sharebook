import {map, switchMap} from 'rxjs/operators';
import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';
import {LoadingBarService} from '@ngx-loading-bar/core';
import {hydrateFormFromVideo} from '../shared/video-edit-utils';
import {VideoSend} from './video-send';
import {CanComponentDeactivate} from "../../../core/routing/can-deactivate-guard.service";
import {VideoEdit} from "../../../shared/main/video/video-edit.model";
import {VideoPrivacy} from "../../../shared/models/videos/video-privacy.enum";
import {FormValidatorService} from "../../../shared/shared-forms/form-validator.service";
import {Notifier} from "../../../core/notification/notifier-service";
import {AuthService} from "../../../core/auth/auth.service";
import {ServerService} from "../../../core/server";
import {VideoService} from "../../../shared/main/video/video.service";
import {VideoCaptionService} from "../../../shared/main/video-caption/video-caption.service";
import {VideoImportService} from "../../../shared/main/video/video-import.service";
import {VideoUpdate} from "../../../shared/models/videos/video-update.model";
import {getAbsoluteAPIUrl, scrollToTop} from "../../../helpers/utils";

@Component({
  selector: 'my-video-import-url',
  templateUrl: './video-import-url.component.html',
  styleUrls: [
    '../shared/video-edit.component.scss',
    './video-send.scss'
  ]
})
export class VideoImportUrlComponent extends VideoSend implements OnInit, CanComponentDeactivate {
  @Output() firstStepDone = new EventEmitter<string>();
  @Output() firstStepError = new EventEmitter<void>();

  targetUrl = '';

  isImportingVideo = false;
  hasImportedVideo = false;
  isUpdatingVideo = false;

  video: VideoEdit;
  error: string;

  protected readonly DEFAULT_VIDEO_PRIVACY = VideoPrivacy.PUBLIC;

  constructor(
    protected formValidatorService: FormValidatorService,
    protected loadingBar: LoadingBarService,
    protected notifier: Notifier,
    protected authService: AuthService,
    protected serverService: ServerService,
    protected videoService: VideoService,
    protected videoCaptionService: VideoCaptionService,
    private router: Router,
    private videoImportService: VideoImportService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  canDeactivate() {
    return {canDeactivate: true};
  }

  isTargetUrlValid() {
    return this.targetUrl && this.targetUrl.match(/https?:\/\//);
  }

  importVideo() {
    this.isImportingVideo = true;

    const videoUpdate: VideoUpdate = {
      privacy: this.firstStepPrivacyId,
      waitTranscoding: false,
      commentsEnabled: true,
      downloadEnabled: true,
      channelId: this.firstStepChannelId
    };

    this.loadingBar.useRef().start();

    this.videoImportService
      .importVideoUrl(this.targetUrl, videoUpdate)
      .pipe(
        switchMap(res => {
          return this.videoCaptionService
            .listCaptions(res.video.id)
            .pipe(
              map(result => ({video: res.video, videoCaptions: result.data}))
            );
        })
      )
      .subscribe(
        ({video, videoCaptions}) => {
          this.loadingBar.useRef().complete();
          this.firstStepDone.emit(video.name);
          this.isImportingVideo = false;
          this.hasImportedVideo = true;

          const absoluteAPIUrl = getAbsoluteAPIUrl();

          const thumbnailUrl = video.thumbnailPath
            ? absoluteAPIUrl + video.thumbnailPath
            : null;

          const previewUrl = video.previewPath
            ? absoluteAPIUrl + video.previewPath
            : null;

          this.video = new VideoEdit(Object.assign(video, {
            commentsEnabled: videoUpdate.commentsEnabled,
            downloadEnabled: videoUpdate.downloadEnabled,
            support: null,
            thumbnailUrl,
            previewUrl
          }));

          this.videoCaptions = videoCaptions;

          hydrateFormFromVideo(this.form, this.video, true);
        },

        err => {
          this.loadingBar.useRef().complete();
          this.isImportingVideo = false;
          this.firstStepError.emit();
          this.notifier.error(err.message);
        }
      );
  }

  updateSecondStep() {
    if (this.checkForm() === false) {
      return;
    }

    this.video.patch(this.form.value);

    this.isUpdatingVideo = true;

    // Update the video
    this.updateVideoAndCaptions(this.video)
      .subscribe(
        () => {
          this.isUpdatingVideo = false;
          this.notifier.success($localize`Video to import updated.`);

          this.router.navigate(['/my-library', 'video-imports']);
        },

        err => {
          this.error = err.message;
          scrollToTop();
          console.error(err);
        }
      );
  }
}
