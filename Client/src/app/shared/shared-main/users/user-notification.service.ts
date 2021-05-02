import {catchError, map, tap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {IUserNotification, UserNotification} from './user-notification.model';
import {SortMeta} from 'primeng/api';
import {AuthService} from "../../../core/auth/auth.service";
import {RestExtractor} from "../../../core/rest/rest-extractor";
import {RestService} from "../../../core/rest/rest.service";
import {ComponentPaginationLight} from "../../../core/rest/component-pagination.model";
import {ResultList} from "../../models";
import {UserNotificationSetting} from "../../models/users/user-notification-setting.model";
import {UserData} from "../../../core/interfaces/common/users";
import {UserStore} from "../../../core/stores/user.store";
import {PeerTubeSocket} from "../../../core/notification/sharebook-socket.service";

@Injectable()
export class UserNotificationService {
  static BASE_NOTIFICATIONS_URL = environment.apiUrl + '/api/v1/users/me/notifications';
  static BASE_NOTIFICATION_SETTINGS = environment.apiUrl + '/api/v1/users/me/notification-settings';

  constructor(
    private authHttp: HttpClient,
    private userStore: UserStore, // AuthService,
    private restExtractor: RestExtractor,
    private restService: RestService,
    private peertubeSocket: PeerTubeSocket,
  ) {
  }

  listMyNotifications(parameters: {
    pagination: ComponentPaginationLight
    ignoreLoadingBar?: boolean
    unread?: boolean,
    sort?: SortMeta
  }) {
    const {pagination, ignoreLoadingBar, unread, sort} = parameters;

    let params = new HttpParams();
    params = this.restService.addRestGetParams(params, this.restService.componentPaginationToRestPagination(pagination), sort);

    if (unread) params = params.append('unread', `${unread}`);

    const headers = ignoreLoadingBar ? {ignoreLoadingBar: ''} : undefined;

    return this.authHttp.get<ResultList<UserNotification>>(UserNotificationService.BASE_NOTIFICATIONS_URL, {
      params,
      headers
    })
      .pipe(
        map(res => this.restExtractor.convertResultListDateToHuman(res)),
        map(res => this.restExtractor.applyToResultListData(res, this.formatNotification.bind(this))),
        catchError(err => this.restExtractor.handleError(err))
      );
  }

  countUnreadNotifications() {
    return this.listMyNotifications({
      pagination: {currentPage: 1, itemsPerPage: 0},
      ignoreLoadingBar: true,
      unread: true
    })
      .pipe(map(n => n.total));
  }

  markAsRead(notification: UserNotification) {
    const url = UserNotificationService.BASE_NOTIFICATIONS_URL + '/read';

    const body = {ids: [notification.id]};
    const headers = {ignoreLoadingBar: ''};

    return this.authHttp.post(url, body, {headers})
      .pipe(
        map(this.restExtractor.extractDataBool),
        tap(() => this.peertubeSocket.dispatchNotificationEvent('read')),
        catchError(res => this.restExtractor.handleError(res))
      );
  }

  markAllAsRead() {
    const url = UserNotificationService.BASE_NOTIFICATIONS_URL + '/read-all';
    const headers = {ignoreLoadingBar: ''};

    return this.authHttp.post(url, {}, {headers})
      .pipe(
        map(this.restExtractor.extractDataBool),
        tap(() => this.peertubeSocket.dispatchNotificationEvent('read-all')),
        catchError(res => this.restExtractor.handleError(res))
      );
  }

  updateNotificationSettings(settings: UserNotificationSetting) {
    const url = UserNotificationService.BASE_NOTIFICATION_SETTINGS;

    return this.authHttp.put(url, settings)
      .pipe(
        map(this.restExtractor.extractDataBool),
        catchError(res => this.restExtractor.handleError(res))
      );
  }

  private formatNotification(notification: IUserNotification) {
    return new UserNotification(notification, this.userStore.getUser());
  }
}