import projectModel from '../models/project.model.js'
import * as projectService from '../services/project.service.js';
import { validationResult } from 'express-validator';
import userModel from '../models/user.model.js';



export const createProject = async (req, res)=>{
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array(),
        })
    }

try{
    const {name} = req.body;
    console.log(req.user.email)
    const loggedInUser = await userModel.findOne({email:req.user.email});
    const userId = loggedInUser._id;

    const newProject = await projectService.createProject({name, userId});
    res.status(200).json({
        msg:"new project added ",
        project:newProject
    })
}
catch (error) {
    res.status(500).json({
        msg: "Server Error",
        error: error.message
    });
}
}



export const getAllProject= async(req, res)=>{
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array(),
        })
    }

    try{
        const loggedInUser = await userModel.findOne({email:req.user.email});
        const userId = loggedInUser._id;
        console.log(userId);
      if(!userId){
        res.status(400).json({
            msg:"userId not found"
        })
      }  

    const allProject = await projectService.getAllProject({userId})
    res.status(200).json({
        msg:"all project are fetched ",
        projects:allProject,
    })


    }catch(err){
        console.log(err);
        res.status(400).json({
            msg:"having trouble in getting all project",
            error:err
        })
    }
}

export const addUserToProject = async(req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array(),
        });
    }

    try {
        const loggedInUser = await userModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;
        const { users, projectId } = req.body; // Expecting an array of users from the frontend
        console.log(req.body.users);
    
        if (!users || !Array.isArray(users)) {
            return res.status(400).json({
                msg: "users array is required"
            });
        }

        if (!projectId) {
            return res.status(400).json({
                msg: "projectId is required"
            });
        }

        console.log(userId);
        const updatedProject = await projectService.addUsersToProject({ users, projectId, userId });
        console.log(updatedProject);

        res.status(200).json({
            msg: "Users added to project",
            project: updatedProject
        });

    } catch (err) {
        res.status(400).json({
            msg: "Having trouble adding users to project",
            error: err
        });
    }
}


export const getAllUsers = async(req, res)=>{
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array(),
        })
    }

    try{
    const { projectId } = req.body;
    if(!projectId){
        res.status(400).json({
            msg:"projectId is required"
        })
    }

    const users = await projectService.getAllUsers({projectId});
    res.status(200).json({
        msg:"all users are :",
        users:users
    })

    }catch(error){
        res.status(400).json({
            msg:"having trouble in fetching users of particular project",
            error:error,
        })
    }
}


export const updateFileTree = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { projectId, fileTree } = req.body;

        const project = await projectService.updateFileTree({
            projectId,
            fileTree
        })

        return res.status(200).json({
            project
        })

    } catch (err) {
        console.log(err)
        res.status(400).json({ error: err.message })
    }

}
