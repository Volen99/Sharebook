import {UserRole} from "./user-role";
import {UserAdminFlag} from "./user-flag.model";

export interface UserUpdate {
  userId?: number;
  password?: string;
  email?: string;
  emailVerified?: boolean;
  videoQuota?: number;
  videoQuotaDaily?: number;
  role?: UserRole;
  adminFlags?: UserAdminFlag;
  pluginAuth?: string;
}
