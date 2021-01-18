import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AuthService, UserService } from '../../core';
import { HooksService } from '../../core/plugins/hooks.service';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { ServerConfig, UserRegister } from '../../shared/models';
import { InstanceAboutAccordionComponent } from '../../shared/shared-instance/instance-about-accordion.component';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [ './register.component.scss' ]
})
export class RegisterComponent implements OnInit {
  private serverConfig: ServerConfig;

  constructor(private route: ActivatedRoute, private authService: AuthService,
              private userService: UserService, private hooks: HooksService) {
  }

  ngOnInit(): void {
    this.serverConfig = this.route.snapshot.data.serverConfig;

    this.videoUploadDisabled = this.serverConfig.user.videoQuota === 0;
    this.stepUserButtonLabel = this.videoUploadDisabled
      ? $localize`:Button on the registration form to finalize the account and channel creation:Signup`
      : this.defaultNextStepButtonLabel;

    this.hooks.runAction('action:signup.register.init', 'signup');
  }

  public accordion: NgbAccordion;
  public info: string = null;
  public error: string = null;
  public success: string = null;
  public signupDone = false;

  public videoUploadDisabled: boolean;

  public formStepAccount: FormGroup;

  public formStepTerms: FormGroup;
  public formStepUser: FormGroup;
  public formStepChannel: FormGroup;


  public aboutHtml = {
    codeOfConduct: ''
  };

  public instanceInformationPanels = {
    codeOfConduct: true,
    terms: true,
    administrators: false,
    features: false,
    moderation: false,
  };

  public defaultPreviousStepButtonLabel = $localize`:Button on the registration form to go to the previous step:Back`;
  public defaultNextStepButtonLabel = $localize`:Button on the registration form to go to the previous step:Next`;
  public stepUserButtonLabel = this.defaultNextStepButtonLabel;

  public accountButtonLabel = this.defaultNextStepButtonLabel;

  public get requiresEmailVerification() {
    return this.serverConfig.signup.requiresEmailVerification;
  }

  public hasSameChannelAndAccountNames() {
    return this.getUsername() === this.getChannelName();
  }

  public getUsername() {
    if (!this.formStepUser) {
      return undefined;
    }

    return this.formStepUser.value['username'];
  }

  public getChannelName() {
    if (!this.formStepChannel) return undefined;

    return this.formStepChannel.value['name'];
  }

  public onAccountFormBuilt(form: FormGroup) {
    this.formStepAccount = form;
  }

  public onTermsFormBuilt(form: FormGroup) {
    this.formStepTerms = form;
  }

  public onUserFormBuilt(form: FormGroup) {
    this.formStepUser = form;
  }

  public onChannelFormBuilt(form: FormGroup) {
    this.formStepChannel = form;
  }

  public onTermsClick() {
    if (this.accordion) this.accordion.toggle('terms');
  }

  public onCodeOfConductClick() {
    if (this.accordion) this.accordion.toggle('code-of-conduct');
  }

  public onInstanceAboutAccordionInit(instanceAboutAccordion: InstanceAboutAccordionComponent) {
    this.accordion = instanceAboutAccordion.accordion;
    this.aboutHtml = instanceAboutAccordion.aboutHtml;
  }

  public async signup() {
    this.error = null;

    const body: UserRegister = await this.hooks.wrapObject(
      Object.assign(this.formStepUser.value, { channel: this.videoUploadDisabled ? undefined : this.formStepChannel.value }),
      'signup',
      'filter:api.signup.registration.create.params'
    );

    this.userService.signup(body).subscribe(
      () => {
        this.signupDone = true;

        if (this.requiresEmailVerification) {
          this.info = $localize`Now please check your emails to verify your account and complete signup.`;
          return;
        }

        // Auto login
        this.authService.login(body.username, body.password)
          .subscribe(
            () => {
              this.success = $localize`You are now logged in as ${body.username}!`;
            },

            err => this.error = err.message
          );
      },

      err => this.error = err.message
    );
  }
}