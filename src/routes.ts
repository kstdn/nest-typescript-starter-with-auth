export const Routes = {
  Authentication: {
    Root: 'authentication',
    Register: 'register',
    Login: 'login',
    RefreshToken: 'refresh-token',
    Logout: 'logout',
    ChangePassword: 'change-password',
  },

  Authorization: {
    Root: 'authorization',
    Resources: 'resources',
    Permissions: {
      Root: 'permissions',
      User: 'user',
      Role: 'role'
    },
    Roles: {
      Root: 'roles',
      User: 'user',
    },
  },

  Users: {
    Root: 'users',
    Me: 'me',
  },
};
