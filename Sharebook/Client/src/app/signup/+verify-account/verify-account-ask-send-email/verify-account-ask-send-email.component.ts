import {Component, OnInit} from '@angular/core';
import {UserService} from "../../../core/users/user.service";
import {ServerService} from "../../../core/server";
import {Notifier} from "../../../core/notification/notifier-service";
import {RedirectService} from "../../../core/routing/redirect.service";
import {USER_EMAIL_VALIDATOR} from "../../../shared/form-validators/user-validators";
import {FormReactive} from "../../../shared/shared-forms/form-reactive";
import {ServerConfig} from "../../../shared/models/server/server-config.model";
import {FormValidatorService} from "../../../shared/shared-forms/form-validator.service";

@Component({
  selector: 'my-verify-account-ask-send-email',
  templateUrl: './verify-account-ask-send-email.component.html',
  styleUrls: ['./verify-account-ask-send-email.component.scss']
})

export class VerifyAccountAskSendEmailComponent extends FormReactive implements OnInit {
  private serverConfig: ServerConfig;

  constructor(
    protected formValidatorService: FormValidatorService,
    private userService: UserService,
    private serverService: ServerService,
    private notifier: Notifier,
    private redirectService: RedirectService
  ) {
    super();
  }

  get requiresEmailVerification() {
    return this.serverConfig.signup.requiresEmailVerification;
  }

  ngOnInit() {
    this.serverConfig = this.serverService.getTmpConfig();
    this.serverService.getConfig()
      .subscribe(config => this.serverConfig = config);

    this.buildForm({
      'verify-email-email': USER_EMAIL_VALIDATOR
    });
  }

  askSendVerifyEmail() {
    const email = this.form.value['verify-email-email'];
    this.userService.askSendVerifyEmail(email)
      .subscribe(
        () => {
          this.notifier.success($localize`An email with verification link will be sent to ${email}.`);
          this.redirectService.redirectToHomepage();
        },

        err => {
          this.notifier.error(err.message);
        }
      );
  }
}
