export const refreshTokenPartialKey = 'refresh_token_partial_1';
export const refreshTokenKey = 'refresh_token';

export class RefreshTokenDto {
  userId: string;
  refreshToken: string;
}
