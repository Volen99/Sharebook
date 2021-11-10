import {DomSanitizer} from "@angular/platform-browser";
import {Component, OnInit} from '@angular/core';

import {
  faTrophy
} from '@fortawesome/pro-light-svg-icons';

import {LocalDataSource} from "ng2-smart-table";
import {SmartTableData} from "../../core/interfaces/common/smart-table";
import {TournamentService} from "../../shared/shared-moderation/tournament-service";
import {NbToastrService} from "../../sharebook-nebular/theme/components/toastr/toastr.service";

@Component({
  selector: 'app-tournament',
  templateUrl: './tournament.component.html',
  styleUrls: ['./tournament.component.scss']
})
export class TournamentComponent implements OnInit {

  constructor(private service: SmartTableData, private sanitizer: DomSanitizer,
              private tournamentService: TournamentService, private notifier: NbToastrService) {
    this.source.setPage(2);

    this.tournamentService.listTournaments('admin')
      .subscribe((dataServer) => {
          let data = dataServer.data;
          this.source.load(data);
        },
        err => this.notifier.danger(err.message, 'Error'));
  }

  ngOnInit(): void {
  }


  settings = {
    pager: {
      display: true,
      perPage: 50
    },
    add: {
      confirmCreate: true,
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      confirmSave: true,
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      id: {
        title: 'id',
        type: 'number',
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      description: {
        title: 'Description',
        type: 'string',
      },
      date: {
        title: 'Date',
        type: 'string',
      },
      displayOrder: {
        title: 'DisplayOrder',
        type: 'number',
      },
      playerCount: {
        title: 'Players',
        type: 'number',
      },
      status: {
        title: 'Status',
        type: 'string',
      },
      site: {
        title: 'Site',
        type: 'string',
      },
      twitter: {
        title: 'Twitter',
        type: 'string',
      },
      facebook: {
        title: 'Facebook',
        type: 'string',
      }, Youtube: {
        title: 'Youtube',
        type: 'string',
      },
      picture: {
        title: 'Url',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  faTrophy = faTrophy;

  onCreateConfirm(event): void {
    this.tournamentService.create(event.newData)
      .subscribe((data) => {
          event.confirm.resolve();
        },
        err => event.confirm.reject());
  }

  onEditConfirm(event) {
    this.tournamentService.edit(event.data.id, event.newData)
      .subscribe((data) => {
          event.confirm.resolve();
        },
        err => event.confirm.reject());
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.tournamentService.delete(event.data.id)
        .subscribe((data) => {
            event.confirm.resolve();
          },
          err => event.confirm.reject());
    } else {
      event.confirm.reject();
    }
  }

}