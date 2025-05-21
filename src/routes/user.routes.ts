import { getUsers, createUser, getUserFilterableDatas, updateUser } from '../controllers/user.controller';
import express from "express"

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/", asyncHandler(createUser));
router.get("/getUserFilterableDatas", asyncHandler(getUserFilterableDatas));
router.get("/", asyncHandler(getUsers));
router.patch('/:uuid', asyncHandler(updateUser));

export default router;