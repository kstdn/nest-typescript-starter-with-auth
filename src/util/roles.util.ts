export const matchRoles = (
  requiredRoles: string[],
  roleNames: string[],
): boolean => {
  return roleNames.some((r): boolean => requiredRoles.includes(r));
};
