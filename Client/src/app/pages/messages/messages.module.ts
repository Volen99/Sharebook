import { NgModule } from '@angular/core';

import { CommonModule } from '@angular/common';
import { MessagesRoutingModule } from './messages-routing.module';
import { MessagesComponent } from './messages.component';
import { DetailHeaderMessageSelectedComponent } from './detail-header-message-selected/detail-header-message-selected.component';
import { SharedGlobalIconModule } from '../../shared/shared-icons/shared-global-icon.module';
import {SharedMainModule} from "../../shared/shared-main/shared-main.module";
import {DetailHeaderNoMessageSelectedComponent} from "./detail-header-no-message-selected/detail-header-no-message-selected.component";
import {NbCardModule} from "../../sharebook-nebular/theme/components/card/card.module";
import {ContactsComponent} from "./contacts/contacts.component";
import {NbTabsetModule} from "../../sharebook-nebular/theme/components/tabset/tabset.module";
import {NbListModule} from "../../sharebook-nebular/theme/components/list/list.module";
import {NbUserModule} from "../../sharebook-nebular/theme/components/user/user.module";
import {NbIconModule} from "../../sharebook-nebular/theme/components/icon/icon.module";
import {AuthModule} from "../../auth/auth.module";
import {MatRippleModule} from "@angular/material/core";
import {NbSpinnerModule} from "../../sharebook-nebular/theme/components/spinner/spinner.module";
import {NbButtonModule} from "../../sharebook-nebular/theme/components/button/button.module";

@NgModule({
  declarations: [
    MessagesComponent,
    ContactsComponent,
    DetailHeaderMessageSelectedComponent,
    DetailHeaderNoMessageSelectedComponent,
  ],
  imports: [
    CommonModule,
    MessagesRoutingModule,
    SharedGlobalIconModule,
    SharedMainModule,
    NbCardModule,
    NbTabsetModule,
    NbListModule,
    NbUserModule,
    NbIconModule,
    AuthModule,
    MatRippleModule,
    NbSpinnerModule,
    NbButtonModule,
  ]
})
export class MessagesModule {
}