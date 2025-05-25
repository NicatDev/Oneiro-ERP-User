import { getModules, createModule, getSingleModuleWithForms, createForm } from '../controllers/module.controller';
import express from "express"
import authMiddleware from '../middlewares/authMiddleware'

const router = express.Router();

const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get("/",asyncHandler(authMiddleware), asyncHandler(getModules));
router.post("/",asyncHandler(authMiddleware), asyncHandler(createModule));
router.get("/:uuid",asyncHandler(authMiddleware), asyncHandler(getSingleModuleWithForms));
router.post("/forms",asyncHandler(authMiddleware), asyncHandler(createForm));


export default router;