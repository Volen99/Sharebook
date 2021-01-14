import { Subject } from 'rxjs';
import { Component, Input, OnInit } from '@angular/core';
import { Notifier, User, UserService } from '../../../core';
import { USER_DESCRIPTION_VALIDATOR, USER_DISPLAY_NAME_REQUIRED_VALIDATOR } from '../../../shared/form-validators/user-validators';
import { FormReactive } from '../../../shared/shared-forms/form-reactive';
import { FormValidatorService } from '../../../shared/shared-forms/form-validator.service';

@Component({
  selector: 'app-account-profile',
  templateUrl: './my-account-profile.component.html',
  styleUrls: [ './my-account-profile.component.scss' ]
})
export class MyAccountProfileComponent extends FormReactive implements OnInit {
  @Input() user: User = null;
  @Input() userInformationLoaded: Subject<any>;

  error: string = null;

  constructor(
    protected formValidatorService: FormValidatorService,
    private notifier: Notifier,
    private userService: UserService
  ) {
    super();
  }

  ngOnInit() {
    this.buildForm({
      'display-name': USER_DISPLAY_NAME_REQUIRED_VALIDATOR,
      description: USER_DESCRIPTION_VALIDATOR
    });

    this.userInformationLoaded.subscribe(() => {
      this.form.patchValue({
        'display-name': this.user.account.displayName,
        description: this.user.account.description
      });
    });
  }

  updateMyProfile() {
    const displayName = this.form.value['display-name'];
    const description = this.form.value['description'] || null;

    this.error = null;

    this.userService.updateMyProfile({
      displayName,
      description
    }).subscribe(
      () => {
        this.user.account.displayName = displayName;
        this.user.account.description = description;

        this.notifier.success($localize`Profile updated.`);
      },

      err => this.error = err.message
    );
  }
}