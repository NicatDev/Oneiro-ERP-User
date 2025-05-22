import { getModulesWithForms } from '../controllers/module.controller';
import express from "express"
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/",asyncHandler(authMiddleware), asyncHandler(getModulesWithForms));


export default router;