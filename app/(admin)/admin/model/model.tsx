export interface DecodedJwt {
    userId: string;
    name: string;
    email: string;
    role: string[];
    isAdmin: boolean;
    iat: number;
    exp: number;
  }

  
export const MAX_SIZE = 2 * 1024 * 1024; // 2MB