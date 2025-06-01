import { getUsers, createUser, resetPassword, getUserFilterableDatas, updateUser, changeStatus, getSingleUser, getDropdownList } from '../controllers/user.controller';
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
router.put('/changeStatus/:uuid',asyncHandler(authMiddleware), asyncHandler(changeStatus));
router.get('/getSingle/:uuid',asyncHandler(authMiddleware), asyncHandler(getSingleUser));
router.get('/getDropdownList',asyncHandler(authMiddleware), asyncHandler(getDropdownList));
router.put('/resetPassword/:uuid',asyncHandler(authMiddleware), asyncHandler(resetPassword));

export default router;  