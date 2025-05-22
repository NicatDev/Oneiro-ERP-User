import { getUsers, createUser, getUserFilterableDatas, updateUser } from '../controllers/user.controller';
import express from "express"
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/",asyncHandler(authMiddleware), asyncHandler(createUser));
router.get("/getUserFilterableDatas",asyncHandler(authMiddleware), asyncHandler(getUserFilterableDatas));
router.get("/",asyncHandler(authMiddleware), asyncHandler(getUsers));
router.patch('/:uuid',asyncHandler(authMiddleware), asyncHandler(updateUser));

export default router;