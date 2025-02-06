import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';


export const createProject = async({
    name, userId
})=>{
    if(!name){
        throw new Error('Name is required');
        
    }
    if(!userId){
        throw new Error("userId is required");
    }

    const existingProject = await projectModel.findOne({ name });
    if (existingProject) {
        throw new Error('Project with this name already exists');
    }

    const project = await projectModel.create({
        name,
        users: [userId]
    });


    return project;
}

export const getAllProject = async({
    userId
})=>{
    if(!userId){
        throw new Error("userId is required");
    }

    const allProject = await projectModel.find({users:userId})

    return allProject;

}


export const addUsersToProject = async({
    users, projectId, userId
})=>{

    if (!Array.isArray(users) || users.some(user => !mongoose.Types.ObjectId.isValid(user))) {
        throw new Error("Invalid user IDs");
    }
    if(!projectId){   
        throw new Error("projectId is required");
    }

    const project = await projectModel.findOne({ _id: projectId, users: userId });
    if (!project) {
        throw new Error('Project not found or user is not authenticated');
    }

    const newUsers = users.filter(user => user !== userId && !project.users.includes(user));
    if (newUsers.length === 0) {
        throw new Error('All users are already added to the project');
    }

    project.users.push(...newUsers);
    await project.save();

    return project;
}


export const getAllUsers = async ({projectId})=>{
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid project ID");
    }
    const project = await projectModel.findById(projectId);
      return project.users;
}




export const updateFileTree = async ({ projectId, fileTree }) => {
    if (!projectId) {
        throw new Error("projectId is required")
    }

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId")
    }

    if (!fileTree) {
        throw new Error("fileTree is required")
    }
    console.log('update starting')
    const project = await projectModel.findOneAndUpdate({
        _id: projectId
    }, {
        fileTree
    }, {
        new: true
    })
   console.log(project)
    return project;
}