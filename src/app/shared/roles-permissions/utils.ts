// import { ROLES } from '@/config/constants';
// import { PERMISSIONS, STATUSES } from '@/data/users-data';
import { PERMISSIONS } from "@/data/roles-permissions";

export const permissions = Object.values(PERMISSIONS).map((permission) => ({
  label: permission,
  value: permission,
}));

// export const statuses = Object.values(STATUSES).map((status) => ({
//   label: status,
//   value: status,
// }));

// export const roles = Object.entries(ROLES).map(([key, value]) => ({
//   label: value,
//   value: key,
// }));
