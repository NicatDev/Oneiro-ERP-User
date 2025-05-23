import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.models';  

const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'Access Token is not valid' });
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string) as User; 
    req.user = decoded; 
    next();  
  } catch (err) {
    console.log(err)
    return res.status(401).json({ message: 'Access Token is not valid' });
  }
};

export default authMiddleware;