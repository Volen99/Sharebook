import 'focus-visible';

import { APP_BASE_HREF, registerLocaleData } from '@angular/common';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ServerService } from '@app/core';
import localeOc from '@app/helpers/locales/oc';
import { MetaLoader, MetaModule, MetaStaticLoader, PageTitlePositioning } from '@ngx-meta/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core';
import { EmptyComponent } from './empty.component';
import { HeaderComponent, SearchTypeaheadComponent, SuggestionComponent } from './header';
import { HighlightPipe } from './header/highlight.pipe';
import { NotificationComponent, LanguageChooserComponent, MenuComponent } from './menu';
import { ConfirmComponent } from './modal/confirm.component';
import { CustomModalComponent } from './modal/custom-modal.component';
import { InstanceConfigWarningModalComponent } from './modal/instance-config-warning-modal.component';
import { QuickSettingsModalComponent } from './modal/quick-settings-modal.component';
import { WelcomeModalComponent } from './modal/welcome-modal.component';
import { SharedMainModule } from './shared/shared-main';
import { SharedUserInterfaceSettingsModule } from './shared/shared-user-settings';
import { ShareButtonComponent } from '@app/menu/share-button/share-button.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UploadComponent } from '@app/modal/upload/upload.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SharedGlobalIconModule } from '@app/shared/shared-icons/shared-global-icon.module';
import { SharedFormModule } from '@app/shared/shared-forms/shared-form.module';
import { SharedInstanceModule } from '@app/shared/shared-instance/shared-instance.module';
import { MoreDropDownComponent } from './menu/more-dropdown/more-drop-down.component';

registerLocaleData(localeOc, 'oc');

@NgModule({
  bootstrap: [ AppComponent ],

  declarations: [
    AppComponent,
    EmptyComponent,

    MenuComponent,
    ShareButtonComponent,          // should not be here?!
    UploadComponent,

    LanguageChooserComponent,
    QuickSettingsModalComponent,
    NotificationComponent,
    HeaderComponent,
    SearchTypeaheadComponent,
    SuggestionComponent,
    HighlightPipe,

    CustomModalComponent,
    WelcomeModalComponent,
    InstanceConfigWarningModalComponent,
    ConfirmComponent,
    MoreDropDownComponent,
  ],

  imports: [
    BrowserModule,

    CoreModule,
    SharedMainModule,
    SharedFormModule,
    SharedUserInterfaceSettingsModule,
    SharedGlobalIconModule,
    SharedInstanceModule,

    MetaModule.forRoot({
      provide: MetaLoader,
      useFactory: (serverService: ServerService) => {
        return new MetaStaticLoader({
          pageTitlePositioning: PageTitlePositioning.PrependPageTitle,
          pageTitleSeparator: ' - ',
          get applicationName() {
            return serverService.getTmpConfig().instance.name;
          },
          defaults: {
            get title() {
              return serverService.getTmpConfig().instance.name;
            },
            get description() {
              return serverService.getTmpConfig().instance.shortDescription;
            }
          }
        });
      },
      deps: [ ServerService ]
    }),

    MatDialogModule,

    AppRoutingModule,

    BrowserAnimationsModule, // Put it after all the modules because it has the 4õ4 route
  ],

  providers: [
    {
      provide: APP_BASE_HREF,
      useValue: '/'
    }
  ]
})
export class AppModule {
}