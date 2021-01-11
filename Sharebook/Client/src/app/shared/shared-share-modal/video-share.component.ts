import {Component, ElementRef, Input, ViewChild} from '@angular/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {buildPlaylistLink, buildVideoLink, buildVideoOrPlaylistEmbed} from '../../../assets/player/utils';
import {VideoDetails} from "../main/video/video-details.model";
import {VideoCaption} from "../models/videos/caption/video-caption.model";
import {VideoPlaylist} from "../shared-video-playlist/video-playlist.model";

type Customizations = {
  startAtCheckbox: boolean
  startAt: number

  stopAtCheckbox: boolean
  stopAt: number

  subtitleCheckbox: boolean
  subtitle: string

  loop: boolean
  originUrl: boolean
  autoplay: boolean
  muted: boolean
  title: boolean
  warningTitle: boolean
  controls: boolean
  peertubeLink: boolean
};

type TabId = 'url' | 'qrcode' | 'embed';

@Component({
  selector: 'my-video-share',
  templateUrl: './video-share.component.html',
  styleUrls: ['./video-share.component.scss']
})
export class VideoShareComponent {
  @ViewChild('modal', {static: true}) modal: ElementRef;

  @Input() video: VideoDetails = null;
  @Input() videoCaptions: VideoCaption[] = [];
  @Input() playlist: VideoPlaylist = null;
  @Input() playlistPosition: number = null;

  activeVideoId: TabId = 'url';
  activePlaylistId: TabId = 'url';

  customizations: Customizations;
  isAdvancedCustomizationCollapsed = true;
  includeVideoInPlaylist = false;

  constructor(private modalService: NgbModal) {
  }

  show(currentVideoTimestamp?: number, currentPlaylistPosition?: number) {
    let subtitle: string;
    if (this.videoCaptions && this.videoCaptions.length !== 0) {
      subtitle = this.videoCaptions[0].language.id;
    }

    this.customizations = {
      startAtCheckbox: false,
      startAt: currentVideoTimestamp ? Math.floor(currentVideoTimestamp) : 0,

      stopAtCheckbox: false,
      stopAt: this.video?.duration,

      subtitleCheckbox: false,
      subtitle,

      loop: false,
      originUrl: false,
      autoplay: false,
      muted: false,

      // Embed options
      title: true,
      warningTitle: true,
      controls: true,
      peertubeLink: true
    };

    this.playlistPosition = currentPlaylistPosition;

    this.modalService.open(this.modal, {centered: true});
  }

  getVideoIframeCode() {
    const options = this.getVideoOptions(this.video.embedUrl);

    const embedUrl = buildVideoLink(options);
    return buildVideoOrPlaylistEmbed(embedUrl);
  }

  getPlaylistIframeCode() {
    const options = this.getPlaylistOptions(this.playlist.embedUrl);

    const embedUrl = buildPlaylistLink(options);
    return buildVideoOrPlaylistEmbed(embedUrl);
  }

  getVideoUrl() {
    let baseUrl = this.customizations.originUrl ? this.video.originInstanceUrl : window.location.origin;
    baseUrl += '/videos/watch/' + this.video.uuid;
    const options = this.getVideoOptions(baseUrl);

    return buildVideoLink(options);
  }

  getPlaylistUrl() {
    const base = window.location.origin + '/videos/watch/playlist/' + this.playlist.uuid;

    if (!this.includeVideoInPlaylist) {
      return base;
    }

    return base + '?playlistPosition=' + this.playlistPosition;
  }

  notSecure() {
    return window.location.protocol === 'http:';
  }

  isVideoInEmbedTab() {
    return this.activeVideoId === 'embed';
  }

  isLocalVideo() {
    return this.video.isLocal;
  }

  private getPlaylistOptions(baseUrl?: string) {
    return {
      baseUrl,

      playlistPosition: this.playlistPosition || undefined
    };
  }

  private getVideoOptions(baseUrl?: string) {
    return {
      baseUrl,

      startTime: this.customizations.startAtCheckbox ? this.customizations.startAt : undefined,
      stopTime: this.customizations.stopAtCheckbox ? this.customizations.stopAt : undefined,

      subtitle: this.customizations.subtitleCheckbox ? this.customizations.subtitle : undefined,

      loop: this.customizations.loop,
      autoplay: this.customizations.autoplay,
      muted: this.customizations.muted,

      title: this.customizations.title,
      warningTitle: this.customizations.warningTitle,
      controls: this.customizations.controls,
      peertubeLink: this.customizations.peertubeLink
    };
  }
}
