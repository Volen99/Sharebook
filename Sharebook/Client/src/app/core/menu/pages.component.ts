import {Component, OnDestroy, OnInit} from '@angular/core';
import {NbMenuItem} from "@nebular/theme";
import {NbTokenService} from "@nebular/auth";
import {InitUserService} from "../../theme/services/init-user.service";
import {takeWhile} from "rxjs/operators";
import {PagesMenu} from "./pages-menu";
import {MenuItem} from "./core/menu.service";

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnDestroy {

  menu: MenuItem[];
  alive: boolean = true;

  constructor(private pagesMenu: PagesMenu,
              private tokenService: NbTokenService,
              protected initUserService: InitUserService) {
    this.initMenu();

    this.tokenService.tokenChange()
      .pipe(takeWhile(() => this.alive))
      .subscribe(() => {
        this.initMenu();
      });
  }

  initMenu() {
    this.pagesMenu.getMenu()
      .pipe(takeWhile(() => this.alive))
      .subscribe(menu => {
        this.menu = menu;
      });
  }

  ngOnDestroy(): void {
    this.alive = false;
  }

}
