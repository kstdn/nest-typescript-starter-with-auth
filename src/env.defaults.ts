import { EnvVariables } from './env.variables';

export const EnvDefaults = {
  [EnvVariables.Port]: 3000,
  [EnvVariables.JwtValidityInMs]: 900000,
  [EnvVariables.RefreshTokenValidityInMs]: 15552000000,
};
