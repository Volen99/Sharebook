import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { mapValues, pickBy } from 'lodash-es';
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";

import {FormReactive} from "../../shared-forms/form-reactive";
import {FormValidatorService} from "../../shared-forms/form-validator.service";
import {ABUSE_REASON_VALIDATOR} from "../../shared-forms/form-validators/abuse-validators";
import {AbusePredefinedReasonsString} from "../../models/moderation/abuse/abuse-reason.model";
import {abusePredefinedReasonsMap} from "../../../core/utils/abuse/abuse-predefined-reasons";
import {AbuseService} from "../abuse.service";

import {
  faTimes,
} from '@fortawesome/pro-light-svg-icons';
import {NbToastrService} from "../../../sharebook-nebular/theme/components/toastr/toastr.service";
import {PostComment} from "../../shared-post-comment/post-comment-model";
import {NbDialogRef} from '../../../sharebook-nebular/theme/components/dialog/dialog-ref';

@Component({
  selector: 'app-comment-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.scss']
})
export class CommentReportComponent extends FormReactive implements OnInit {
  @Input() comment: PostComment = null;

  @ViewChild('modal', {static: true}) modal: NgbModal;

  modalTitle: string;
  error: string = null;
  predefinedReasons: { id: AbusePredefinedReasonsString, label: string, description?: string, help?: string }[] = [];

  private openedModal: NgbModalRef;

  constructor(
    protected formValidatorService: FormValidatorService,
    private modalService: NgbModal,
    private abuseService: AbuseService,
    private notifier: NbToastrService,
    private ref: NbDialogRef<CommentReportComponent>) {
    super();
  }

  get currentHost() {
    return 'Chessbook';
  }

  get originHost() {
    // if (this.isRemote()) {
    //   return this.reply-comment.user.host;
    // }

    return '';
  }

  ngOnInit() {
    this.modalTitle = `Report comment`;

    this.buildForm({
      reason: ABUSE_REASON_VALIDATOR,
      predefinedReasons: mapValues(abusePredefinedReasonsMap, r => null)
    });

    this.predefinedReasons = this.abuseService.getPrefefinedReasons('comment');
  }

  faTimes = faTimes;

  show() {
    this.openedModal = this.modalService.open(this.modal, {centered: true, keyboard: false, size: 'lg'});
  }

  hide() {
    this.ref.close();
    // this.openedModal.close();
    // this.openedModal = null;
  }

  report() {
    const reason = this.form.get('reason').value;
    const predefinedReasons = Object.keys(pickBy(this.form.get('predefinedReasons').value)) as AbusePredefinedReasonsString[];

    this.abuseService.reportVideo({
      reason,
      predefinedReasons,
      comment: {
        id: this.comment.id
      }
    }).subscribe(
      () => {
        this.notifier.success(`Comment reported.`, 'Success');
        this.hide();
      },

      err => this.notifier.danger(err.message, 'Error')
    );
  }

  isRemote() {
    return !this.comment.isLocal;
  }
}
