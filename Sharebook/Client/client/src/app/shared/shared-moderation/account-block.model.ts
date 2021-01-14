import { AccountBlock as AccountBlockServer } from '../../../../../shared/models';
import { Account } from '../../shared/shared-main/account/account.model';

export class AccountBlock implements AccountBlockServer {
  byAccount: Account;
  blockedAccount: Account;
  createdAt: Date | string;

  constructor(block: AccountBlockServer) {
    this.byAccount = new Account(block.byAccount);
    this.blockedAccount = new Account(block.blockedAccount);
    this.createdAt = block.createdAt;
  }
}
