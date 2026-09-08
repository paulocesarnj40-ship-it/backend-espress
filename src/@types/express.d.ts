// src/@types/express.d.ts
import { JwtPayload } from './jwt.payload.js'; // se tiver o tipo separado, ou defina inline:

export interface UserPayload {
  id: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
