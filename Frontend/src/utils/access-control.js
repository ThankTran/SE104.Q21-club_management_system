const MANAGER_PRIORITY_MAX = 1;

export const MEMBER_ROUTES = [
  "/home",
  "/profile",
  "/help",
  "/resourcesuser",
  "/eventuser",
  "/memberuser",
  "/memberdues",
];

export const MANAGER_ROUTES = [
  "/dashboard",
  "/memberadmin",
  "/resourcesadmin",
  "/eventadmin",
  "/finance",
  "/account",
  "/settings",
];

export const isAuthenticated = (user, token) => Boolean(user && token);

export const isManager = (user) => {
  const priority = Number(user?.rolePriority);
  return Number.isFinite(priority) && priority <= MANAGER_PRIORITY_MAX;
};

export const getDefaultPath = (user) => (isManager(user) ? "/dashboard" : "/home");

export const canAccessPath = (path, user, token) => {
  if (!path || path === "/" || path === "/signin") return true;
  if (!isAuthenticated(user, token)) return false;

  if (MANAGER_ROUTES.some((route) => path === route || path.startsWith(`${route}/`))) {
    return isManager(user);
  }

  return MEMBER_ROUTES.some((route) => path === route || path.startsWith(`${route}/`));
};
