import {Account as ServerAccount} from '../../../shared/main/account/account.model';
import {Actor} from './actor.model';
import {Avatar} from "../../models/avatars/avatar.model";

export class Account extends Actor implements ServerAccount {
  displayName: string;
  description: string;
  nameWithHost: string;
  nameWithHostForced: string;
  mutedByUser: boolean;
  mutedByInstance: boolean;
  mutedServerByUser: boolean;
  mutedServerByInstance: boolean;

  userId?: number;

  static GET_ACTOR_AVATAR_URL(actor: object) {
    return Actor.GET_ACTOR_AVATAR_URL(actor) || this.GET_DEFAULT_AVATAR_URL();
  }

  static GET_DEFAULT_AVATAR_URL() {
    return `${window.location.origin}/src/assets/images/default-avatar-account.png`;
  }

  constructor(hash: ServerAccount) {
    super(hash);

    this.updateComputedAttributes();

    this.displayName = hash.displayName;
    this.description = hash.description;
    this.userId = hash.userId;
    this.nameWithHost = Actor.CREATE_BY_STRING(this.name, this.host);
    this.nameWithHostForced = Actor.CREATE_BY_STRING(this.name, this.host, true);

    this.mutedByUser = false;
    this.mutedByInstance = false;
    this.mutedServerByUser = false;
    this.mutedServerByInstance = false;
  }

  updateAvatar(newAvatar: Avatar) {
    this.avatar = newAvatar;

    this.updateComputedAttributes();
  }

  private updateComputedAttributes() {
    this.avatarUrl = Account.GET_ACTOR_AVATAR_URL(this);
  }
}
