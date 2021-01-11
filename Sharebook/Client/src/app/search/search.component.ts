import {forkJoin, of, Subscription} from 'rxjs';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MetaService} from '@ngx-meta/core';
import {AdvancedSearch} from "../shared/search/advanced-search.model";
import {SearchService} from "../shared/search/search.service";
import {Video} from "../shared/main/video/video.model";
import {VideoChannel} from "../shared/main/video-channel/video-channel.model";
import {MiniatureDisplayOptions, VideoLinkType} from "../shared/shared-video-miniature/video-miniature.component";
import {ServerConfig} from "../shared/models/server/server-config.model";
import {SearchTargetType} from "../shared/models/search/search-target-query.model";
import {immutableAssign} from "../helpers/utils";
import {ComponentPagination} from "../core/rest/component-pagination.model";
import {User} from "../core/users/user.model";
import {Notifier} from "../core/notification/notifier-service";
import {AuthService} from "../core/auth/auth.service";
import {UserService} from "../core/users/user.service";
import {HooksService} from "../core/plugins";
import {ServerService} from "../core/server";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['../../assets/css/site.css', /*'../sidebar-column.component.css',*/ './search.component.css']
})
export class SearchComponent implements OnInit, OnDestroy {
  results: (Video | VideoChannel)[] = [];

  pagination: ComponentPagination = {
    currentPage: 1,
    itemsPerPage: 10, // Only for videos, use another variable for channels
    totalItems: null
  };
  advancedSearch: AdvancedSearch = new AdvancedSearch();
  isSearchFilterCollapsed = true;
  currentSearch: string;

  videoDisplayOptions: MiniatureDisplayOptions = {
    date: true,
    views: true,
    by: true,
    avatar: false,
    privacyLabel: false,
    privacyText: false,
    state: false,
    blacklistInfo: false
  };

  errorMessage: string;
  serverConfig: ServerConfig;

  userMiniature: User;

  private subActivatedRoute: Subscription;
  private isInitialLoad = false; // set to false to show the search filters on first arrival
  private firstSearch = true;

  private channelsPerPage = 2;

  private lastSearchTarget: SearchTargetType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private metaService: MetaService,
    private notifier: Notifier,
    private searchService: SearchService,
    private authService: AuthService,
    private userService: UserService,
    private hooks: HooksService,
    private serverService: ServerService,
  ) {
  }

  ngOnInit() {
    this.serverService.getConfig()
      .subscribe(config => this.serverConfig = config);

    this.subActivatedRoute = this.route.queryParams.subscribe(
      async queryParams => {
        const querySearch = queryParams['search'];
        const searchTarget = queryParams['searchTarget'];

        // Search updated, reset filters
        if (this.currentSearch !== querySearch || searchTarget !== this.advancedSearch.searchTarget) {
          this.resetPagination();
          this.advancedSearch.reset();

          this.currentSearch = querySearch || undefined;
          this.updateTitle();
        }

        this.advancedSearch = new AdvancedSearch(queryParams);
        if (!this.advancedSearch.searchTarget) {
          this.advancedSearch.searchTarget = await this.serverService.getDefaultSearchTarget();
        }

        // Don't hide filters if we have some of them AND the user just came on the webpage
        this.isSearchFilterCollapsed = this.isInitialLoad === false || !this.advancedSearch.containsValues();
        this.isInitialLoad = false;

        this.search();
      },

      err => this.notifier.error(err.text)
    );

    this.userService.getAnonymousOrLoggedUser()
      .subscribe(user => this.userMiniature = user);

    this.hooks.runAction('action:search.init', 'search');
  }

  ngOnDestroy() {
    if (this.subActivatedRoute) {
      this.subActivatedRoute.unsubscribe();
    }
  }

  isVideoChannel(d: VideoChannel | Video): d is VideoChannel {
    return d instanceof VideoChannel;
  }

  isVideo(v: VideoChannel | Video): v is Video {
    return v instanceof Video;
  }

  isUserLoggedIn() {
    return this.authService.isLoggedIn();
  }

  getVideoLinkType(): VideoLinkType {
    if (this.advancedSearch.searchTarget === 'search-index') {
      const remoteUriConfig = this.serverConfig.search.remoteUri;

      // Redirect on the external instance if not allowed to fetch remote data
      if ((!this.isUserLoggedIn() && !remoteUriConfig.anonymous) || !remoteUriConfig.users) {
        return 'external';
      }

      return 'lazy-load';
    }

    return 'internal';
  }

  isExternalChannelUrl() {
    return this.getVideoLinkType() === 'external';
  }

  search() {
    forkJoin([
      this.getVideosObs(),
      this.getVideoChannelObs()
    ]).subscribe(
      ([videosResult, videoChannelsResult]) => {
        this.results = this.results
          .concat(videoChannelsResult.data)
          .concat(videosResult.data);

        this.pagination.totalItems = videosResult.total + videoChannelsResult.total;
        this.lastSearchTarget = this.advancedSearch.searchTarget;

        // Focus on channels if there are no enough videos
        if (this.firstSearch === true && videosResult.data.length < this.pagination.itemsPerPage) {
          this.resetPagination();
          this.firstSearch = false;

          this.channelsPerPage = 10;
          this.search();
        }

        this.firstSearch = false;
      },

      err => {
        if (this.advancedSearch.searchTarget !== 'search-index') {
          this.notifier.error(err.message);
          return;
        }

        this.notifier.error(
          $localize`Search index is unavailable. Retrying with instance results instead.`,
          $localize`Search error`
        );
        this.advancedSearch.searchTarget = 'local';
        this.search();
      }
    );
  }

  onNearOfBottom() {
    // Last page
    if (this.pagination.totalItems <= (this.pagination.currentPage * this.pagination.itemsPerPage)) {
      return;
    }

    this.pagination.currentPage += 1;
    this.search();
  }

  onFiltered() {
    this.resetPagination();

    this.updateUrlFromAdvancedSearch();
  }

  numberOfFilters() {
    return this.advancedSearch.size();
  }

  // Add VideoChannel for typings, but the template already checks "video" argument is a video
  removeVideoFromArray(video: Video | VideoChannel) {
    this.results = this.results.filter(r => !this.isVideo(r) || r.id !== video.id);
  }

  getChannelUrl(channel: VideoChannel) {
    // Same algorithm than videos
    if (this.getVideoLinkType() === 'external') {
      return channel.url;
    }

    if (this.getVideoLinkType() === 'internal') {
      return ['/video-channels', channel.nameWithHost];
    }

    return ['/search/lazy-load-channel', {url: channel.url}];
  }

  hideActions() {
    return this.lastSearchTarget === 'search-index';
  }

  private resetPagination() {
    this.pagination.currentPage = 1;
    this.pagination.totalItems = null;
    this.channelsPerPage = 2;

    this.results = [];
  }

  private updateTitle() {
    const suffix = this.currentSearch ? ' ' + this.currentSearch : '';
    this.metaService.setTitle($localize`Search` + suffix);
  }

  private updateUrlFromAdvancedSearch() {
    const search = this.currentSearch || undefined;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: Object.assign({}, this.advancedSearch.toUrlObject(), {search})
    });
  }

  private getVideosObs() {
    const params = {
      search: this.currentSearch,
      componentPagination: this.pagination,
      advancedSearch: this.advancedSearch
    };

    return this.hooks.wrapObsFun(
      this.searchService.searchVideos.bind(this.searchService),
      params,
      'search',
      'filter:api.search.videos.list.params',
      'filter:api.search.videos.list.result'
    );
  }

  private getVideoChannelObs() {
    if (!this.currentSearch) {
      return of({data: [], total: 0});
    }

    const params = {
      search: this.currentSearch,
      componentPagination: immutableAssign(this.pagination, {itemsPerPage: this.channelsPerPage}),
      searchTarget: this.advancedSearch.searchTarget
    };

    return this.hooks.wrapObsFun(
      this.searchService.searchVideoChannels.bind(this.searchService),
      params,
      'search',
      'filter:api.search.video-channels.list.params',
      'filter:api.search.video-channels.list.result'
    );
  }
}
