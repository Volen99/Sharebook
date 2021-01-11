import {Observable} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {RestService} from "../../../core/rest/rest.service";
import {RestExtractor} from "../../../core/rest/rest-extractor.service";
import {PluginService} from "../../../core/plugins";
import {ComponentPagination} from "../../../core/rest/component-pagination.model";
import {peertubeTranslate} from "../../../shared/core-utils/i18n/i18n";
import {ResultList} from "../../../shared/models/result-list.model";
import {PluginType} from "../../../shared/models/plugins/plugin.type";
import {PeerTubePlugin} from "../../../shared/models/plugins/peertube-plugin.model";
import {PeerTubePluginIndex} from "../../../shared/models/plugins/peertube-plugin-index.model";
import {RegisteredServerSettings} from "../../../shared/models/plugins/register-server-setting.model";
import {ManagePlugin} from "../../../shared/models/plugins/manage-plugin.model";
import {InstallOrUpdatePlugin} from "../../../shared/models/plugins/install-plugin.model";

@Injectable()
export class PluginApiService {
  private static BASE_PLUGIN_URL = environment.apiUrl + '/api/v1/plugins';

  constructor(
    private authHttp: HttpClient,
    private restExtractor: RestExtractor,
    private restService: RestService,
    private pluginService: PluginService
  ) {
  }

  getPluginTypeOptions() {
    return [
      {
        label: $localize`Plugins`,
        value: PluginType.PLUGIN
      },
      {
        label: $localize`Themes`,
        value: PluginType.THEME
      }
    ];
  }

  getPluginTypeLabel(type: PluginType) {
    if (type === PluginType.PLUGIN) {
      return $localize`plugin`;
    }

    return $localize`theme`;
  }

  getPlugins(
    pluginType: PluginType,
    componentPagination: ComponentPagination,
    sort: string
  ) {
    const pagination = this.restService.componentPaginationToRestPagination(componentPagination);

    let params = new HttpParams();
    params = this.restService.addRestGetParams(params, pagination, sort);
    params = params.append('pluginType', pluginType.toString());

    return this.authHttp.get<ResultList<PeerTubePlugin>>(PluginApiService.BASE_PLUGIN_URL, {params})
      .pipe(catchError(res => this.restExtractor.handleError(res)));
  }

  searchAvailablePlugins(
    pluginType: PluginType,
    componentPagination: ComponentPagination,
    sort: string,
    search?: string
  ) {
    const pagination = this.restService.componentPaginationToRestPagination(componentPagination);

    let params = new HttpParams();
    params = this.restService.addRestGetParams(params, pagination, sort);
    params = params.append('pluginType', pluginType.toString());

    if (search) {
      params = params.append('search', search);
    }

    return this.authHttp.get<ResultList<PeerTubePluginIndex>>(PluginApiService.BASE_PLUGIN_URL + '/available', {params})
      .pipe(catchError(res => this.restExtractor.handleError(res)));
  }

  getPlugin(npmName: string) {
    const path = PluginApiService.BASE_PLUGIN_URL + '/' + npmName;

    return this.authHttp.get<PeerTubePlugin>(path)
      .pipe(catchError(res => this.restExtractor.handleError(res)));
  }

  getPluginRegisteredSettings(pluginName: string, pluginType: PluginType) {
    const npmName = this.pluginService.nameToNpmName(pluginName, pluginType);
    const path = PluginApiService.BASE_PLUGIN_URL + '/' + npmName + '/registered-settings';

    return this.authHttp.get<RegisteredServerSettings>(path)
      .pipe(
        switchMap(res => this.translateSettingsLabel(npmName, res)),
        catchError(res => this.restExtractor.handleError(res))
      );
  }

  updatePluginSettings(pluginName: string, pluginType: PluginType, settings: any) {
    const npmName = this.pluginService.nameToNpmName(pluginName, pluginType);
    const path = PluginApiService.BASE_PLUGIN_URL + '/' + npmName + '/settings';

    return this.authHttp.put(path, {settings})
      .pipe(catchError(res => this.restExtractor.handleError(res)));
  }

  uninstall(pluginName: string, pluginType: PluginType) {
    const body: ManagePlugin = {
      npmName: this.pluginService.nameToNpmName(pluginName, pluginType)
    };

    return this.authHttp.post(PluginApiService.BASE_PLUGIN_URL + '/uninstall', body)
      .pipe(catchError(res => this.restExtractor.handleError(res)));
  }

  update(pluginName: string, pluginType: PluginType) {
    const body: ManagePlugin = {
      npmName: this.pluginService.nameToNpmName(pluginName, pluginType)
    };

    return this.authHttp.post(PluginApiService.BASE_PLUGIN_URL + '/update', body)
      .pipe(catchError(res => this.restExtractor.handleError(res)));
  }

  install(npmName: string) {
    const body: InstallOrUpdatePlugin = {
      npmName
    };

    return this.authHttp.post(PluginApiService.BASE_PLUGIN_URL + '/install', body)
      .pipe(catchError(res => this.restExtractor.handleError(res)));
  }

  private translateSettingsLabel(npmName: string, res: RegisteredServerSettings): Observable<RegisteredServerSettings> {
    return this.pluginService.translationsObservable
      .pipe(
        map(allTranslations => allTranslations[npmName]),
        map(translations => {
          const registeredSettings = res.registeredSettings
            .map(r => {
              return Object.assign({}, r, {label: peertubeTranslate(r.label, translations)});
            });

          return {registeredSettings};
        })
      );
  }
}
