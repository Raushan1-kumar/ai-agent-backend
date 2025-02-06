import { Router } from "express";
import { authUser } from "../middleware/auth.middleware.js";
import * as projectController from '../controllers/project.controller.js'
import { body } from "express-validator";
const router = Router();


router.post('/create', 
    body('name').isString().withMessage('Name is required'), 
    authUser,projectController.createProject
)

router.get('/get-all-projects', authUser,projectController.getAllProject)

router.put('/add-users',
    body('projectId').isString().withMessage('Project ID is required'),
    authUser,
    projectController.addUserToProject
)

router.post('/get-users',
    body('projectId').isString().withMessage('Project ID is required'),
    authUser,
    projectController.getAllUsers
)



router.put('/update-file-tree',
    authUser,
    body('projectId').isString().withMessage('Project ID is required'),
    body('fileTree').isObject().withMessage('File tree is required'),
    projectController.updateFileTree
)


export default router;