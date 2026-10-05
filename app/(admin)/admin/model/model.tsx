export interface DecodedJwt {
    userId: string;
    name: string;
    email: string;
    role: string[];
    isAdmin: boolean;
    iat: number;
    exp: number;
  }