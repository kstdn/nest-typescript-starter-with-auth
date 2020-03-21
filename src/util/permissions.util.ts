export const matchPermissions = (
  requiredPermissions: string[],
  permissionNames: string[],
): boolean => {
  return permissionNames.some((r): boolean => requiredPermissions.includes(r));
};
