import {Video} from './video.model';
import {Account} from '../actors/account.model';

export interface VideoChangeOwnership {
  id: number;
  status: VideoChangeOwnershipStatus;
  initiatorAccount: Account;
  nextOwnerAccount: Account;
  video: Video;
  createdAt: Date;
}

export const enum VideoChangeOwnershipStatus {
  WAITING = 'WAITING',
  ACCEPTED = 'ACCEPTED',
  REFUSED = 'REFUSED',
}
