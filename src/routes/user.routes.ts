import { getUsers, createUser } from '../controllers/user.controller';
import express from "express"

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/register", asyncHandler(createUser));
router.get("/get", asyncHandler(getUsers));

export default router;