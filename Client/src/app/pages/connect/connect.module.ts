import {NgModule} from "@angular/core";

import {CommonModule} from "@angular/common";
import { SidebarColumnModule } from '../../shared/sidebar-column/sidebar-column.module';
import { ConnectRoutingModule } from './connect-routing.module';
import {NbCardModule} from "../../sharebook-nebular/theme/components/card/card.module";
import {ConnectComponent} from "./connect.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";
import {NbListModule} from "../../sharebook-nebular/theme/components/list/list.module";
import {NbUserModule} from "../../sharebook-nebular/theme/components/user/user.module";
import {SharedModule} from "../../shared/shared.module";
import {SharedGlobalIconModule} from "../../shared/shared-icons/shared-global-icon.module";
import {SharedMainModule} from "../../shared/shared-main/shared-main.module";

@NgModule({
  declarations: [
    ConnectComponent,
  ],
  imports: [
    ConnectRoutingModule,
    CommonModule,
    SidebarColumnModule,
    NbCardModule,
    FontAwesomeModule,
    NbListModule,
    NbUserModule,
    SharedModule,
    SharedGlobalIconModule,
    SharedMainModule,
  ]
})
export class ConnectModule {
}