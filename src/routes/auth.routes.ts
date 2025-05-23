import { login, logout, refreshToken } from '../controllers/auth.controller';
import express from "express"

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};


router.post("/login", asyncHandler(login));
router.post("/logout", asyncHandler(logout));
router.post("/refresh", asyncHandler(refreshToken));

export default router;