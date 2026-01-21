export interface JwtPayload {
  sub: string; // wallet address
  iat: number;
  exp: number;
}

export interface AuthUser {
  address: string;
}
