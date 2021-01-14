import { Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Notifier } from '../../../core';
import { PeerTubePlugin, RegisterServerSettingOptions } from '../../../../../../shared/models';
import { PluginApiService } from '../shared/plugin-api.service';
import { FormReactive } from '../../../shared/shared-forms/form-reactive';
import { FormValidatorService } from '../../../shared/shared-forms/form-validator.service';
import { BuildFormArgument } from '../../../shared/form-validators/form-validator.model';

@Component({
  selector: 'app-plugin-show-installed',
  templateUrl: './plugin-show-installed.component.html',
  styleUrls: [ './plugin-show-installed.component.scss' ]
})
export class PluginShowInstalledComponent extends FormReactive implements OnInit, OnDestroy {
  plugin: PeerTubePlugin;
  registeredSettings: RegisterServerSettingOptions[] = [];
  pluginTypeLabel: string;

  private sub: Subscription;

  constructor(
    protected formValidatorService: FormValidatorService,
    private pluginService: PluginApiService,
    private notifier: Notifier,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(
      routeParams => {
        const npmName = routeParams['npmName'];

        this.loadPlugin(npmName);
      }
    );
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  formValidated() {
    const settings = this.form.value;

    this.pluginService.updatePluginSettings(this.plugin.name, this.plugin.type, settings)
      .subscribe(
        () => {
          this.notifier.success($localize`Settings updated.`);
        },

        err => this.notifier.error(err.message)
      );
  }

  hasRegisteredSettings() {
    return Array.isArray(this.registeredSettings) && this.registeredSettings.length !== 0;
  }

  private loadPlugin(npmName: string) {
    this.pluginService.getPlugin(npmName)
      .pipe(switchMap(plugin => {
        return this.pluginService.getPluginRegisteredSettings(plugin.name, plugin.type)
          .pipe(map(data => ({
            plugin,
            registeredSettings: data.registeredSettings
          })));
      }))
      .subscribe(
        ({
           plugin,
           registeredSettings
         }) => {
          this.plugin = plugin;
          this.registeredSettings = registeredSettings;

          this.pluginTypeLabel = this.pluginService.getPluginTypeLabel(this.plugin.type);

          this.buildSettingsForm();
        },

        err => this.notifier.error(err.message)
      );
  }

  private buildSettingsForm() {
    const buildOptions: BuildFormArgument = {};
    const settingsValues: any = {};

    for (const setting of this.registeredSettings) {
      buildOptions[setting.name] = null;
      settingsValues[setting.name] = this.getSetting(setting.name);
    }

    this.buildForm(buildOptions);

    this.form.patchValue(settingsValues);
  }

  private getSetting(name: string) {
    const settings = this.plugin.settings;

    if (settings && settings[name]) return settings[name];

    const registered = this.registeredSettings.find(r => r.name === name);

    return registered.default;
  }

}