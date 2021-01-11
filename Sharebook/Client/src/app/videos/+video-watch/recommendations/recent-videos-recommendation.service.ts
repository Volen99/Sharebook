import {Observable, of} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {RecommendationInfo} from './recommendation-info.model';
import {RecommendationService} from './recommendations.service';
import {ServerConfig} from "../../../shared/models/server/server-config.model";
import {VideoService} from "../../../shared/main/video/video.service";
import {SearchService} from "../../../shared/search/search.service";
import {UserService} from "../../../core/users/user.service";
import {ServerService} from "../../../core/server";
import {Video} from "../../../shared/main/video/video.model";
import {AdvancedSearch} from "../../../shared/search/advanced-search.model";

/**
 * Provides "recommendations" by providing the most recently uploaded videos.
 */
@Injectable()
export class RecentVideosRecommendationService implements RecommendationService {
  readonly pageSize = 5;

  private config: ServerConfig;

  constructor(
    private videos: VideoService,
    private searchService: SearchService,
    private userService: UserService,
    private serverService: ServerService,
  ) {
    this.config = this.serverService.getTmpConfig();

    this.serverService.getConfig()
      .subscribe(config => this.config = config);
  }

  getRecommendations(recommendation: RecommendationInfo): Observable<Video[]> {
    return this.fetchPage(1, recommendation)
      .pipe(
        map(videos => {
          const otherVideos = videos.filter(v => v.uuid !== recommendation.uuid);
          return otherVideos.slice(0, this.pageSize);
        })
      );
  }

  private fetchPage(page: number, recommendation: RecommendationInfo): Observable<Video[]> {
    const pagination = {currentPage: page, itemsPerPage: this.pageSize + 1};
    const defaultSubscription = this.videos.getVideos({videoPagination: pagination, sort: '-createdAt'})
      .pipe(map(v => v.data));

    const tags = recommendation.tags;
    const searchIndexConfig = this.config.search.searchIndex;
    if (
      !tags || tags.length === 0 ||
      (searchIndexConfig.enabled === true && searchIndexConfig.disableLocalSearch === true)
    ) {
      return defaultSubscription;
    }

    return this.userService.getAnonymousOrLoggedUser()
      .pipe(
        map(user => {
          return {
            search: '',
            componentPagination: pagination,
            advancedSearch: new AdvancedSearch({
              tagsOneOf: recommendation.tags.join(','),
              sort: '-createdAt',
              searchTarget: 'local',
              nsfw: user.nsfwPolicy
                ? this.videos.nsfwPolicyToParam(user.nsfwPolicy)
                : undefined
            })
          };
        }),
        switchMap(params => this.searchService.searchVideos(params)),
        map(v => v.data),
        switchMap(videos => {
          if (videos.length <= 1) {
            return defaultSubscription;
          }

          return of(videos);
        })
      );
  }
}
