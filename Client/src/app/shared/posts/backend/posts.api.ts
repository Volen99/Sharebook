import {Injectable} from "@angular/core";
import {HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

import {HttpService} from "../../../core/backend/common/api/http.service";
import {UserVideoRate} from "../models/rate/user-video-rate.model";

@Injectable()
export class PostsApi {
    private readonly apiController: string = 'posts';
    private readonly voteApiController: string = 'vote';

    constructor(private api: HttpService) {
    }

    getPost(id): Observable<any> {
        return this.api.get(`${this.apiController}/${id}`);
    }

    publishTweetAsync(params: HttpParams, body?: {}): Observable<any> {
        return this.api.post(this.apiController, body, {params});
    }

    publishRetweetAsync(url: string, params: HttpParams, body?: {}): Observable<any> {
        return this.api.post(`${this.apiController}/${url}`, body, {params});
    }

    getUserVideoRating(url: string) {
        return this.api.get<UserVideoRate>(url);
    }

    removePost(url: string) {
        return this.api.delete(`${this.apiController}/${url}`);
    }

    getProfilePosts<T>(url: string, params: HttpParams) {
        return this.api.get(`${this.apiController}/${url}`, {params});
    }

    getPostPhotos(url: string) {
        return this.api.get(`${this.apiController}/${url}`);
    }

    destroyTweetAsync(url: string, params: HttpParams, body?: {}): Observable<any> {
        return this.api.post(`${this.apiController}/${url}`, {}, {params});
    }

    votePostAsync(params: HttpParams): Observable<any> {
        return this.api.post(this.voteApiController, {}, {params});
    }

    getLikers(url: string) {
        return this.api.get(`${this.apiController}/${url}`);
    }

    pinPost(url: string) {
        return this.api.post(`${this.apiController}/${url}`, {});
    }

    unpinPost(url: string) {
        return this.api.post(`${this.apiController}/${url}`, {});
    }

    getPinnedPost(url: string) {
        return this.api.get(`${this.apiController}/${url}`);
    }

    repost(url: string) {
        return this.api.post(`${this.apiController}/${url}`, {});
    }

    unrepost(url: string) {
        return this.api.post(`${this.apiController}/${url}`, {});
    }

    getReposters(url: string) {
        return this.api.get(`${this.apiController}/${url}`);
    }

    deletePost(url: string, isAdmin: boolean = false) {
        let fullUrl = `${this.apiController}/${url}`;
        if (isAdmin) {
            fullUrl = `admin/post/${url}`;
        }

        return this.api.post(fullUrl, {});
    }

}
