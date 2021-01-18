import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth';
import { catchError } from 'rxjs/operators';
import { RestExtractor } from '../rest';
import { ScopedToken } from '../../shared/models/users/user-scoped-token';

@Injectable()
export class ScopedTokensService {
  private static BASE_SCOPED_TOKENS_URL = environment.apiUrl + '/api/v1/users/scoped-tokens';

  constructor(
    private authHttp: HttpClient,
    private restExtractor: RestExtractor
  ) {
  }

  getScopedTokens() {
    return this.authHttp
      .get<ScopedToken>(ScopedTokensService.BASE_SCOPED_TOKENS_URL)
      .pipe(
        catchError(res => this.restExtractor.handleError(res))
      );
  }

  renewScopedTokens() {
    return this.authHttp
      .post<ScopedToken>(ScopedTokensService.BASE_SCOPED_TOKENS_URL, {})
      .pipe(
        catchError(res => this.restExtractor.handleError(res))
      );
  }
}