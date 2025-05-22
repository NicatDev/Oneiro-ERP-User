import { User } from './src/models/user.models';
declare global {
  namespace Express {
    interface Request {
      user?: User;  
    }
  }
}

export {};