import { Router } from "express";
import * as userController from '../controllers/user.controller.js'
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post('/register',
    body('email').isEmail().withMessage("Invalid email format"),
    body('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
    userController.createUserController
);

router.post('/login',
    body('email').isEmail().withMessage("Invalid email format"),
    body('password').isLength({ min: 6 }).withMessage("Password must have at least 6 characters"),
    userController.loginUser
)
router.get('/profile',authUser,userController.getProfile);

router.get('/logout', authUser, userController.logOutUser)

router.get('/all-users', authUser, userController.getAllUser)

export default router;
