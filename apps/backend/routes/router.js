import { Router } from "express";
import authRouter from "./authRouter.js";
import postRouter from "./postRouter.js";

const router = Router();

router.use('/auth', authRouter);
router.use('/posts', postRouter)

export default router;