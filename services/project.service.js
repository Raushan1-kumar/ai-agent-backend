import projectModel from '../models/project.model.js';
import mongoose from 'mongoose';


export const createProject = async({
    name, email
})=>{
    console.log(name, email);
    if(!name){
        throw new Error('Name is required');
        
    }
    if(!email){
        throw new Error("email is required");
    }

    const existingProject = await projectModel.findOne({ name });
    if (existingProject) {
        throw new Error('Project with this name already exists');
    }

    const project = await projectModel.create({
        name,
        users: [email]
    });

    console.log("new project created");
    return project;
}

export const getAllProject = async({
    email
})=>{
    if(!email){
        throw new Error("email is required");
    }

    const allProject = await projectModel.find({users:email})

    return allProject;

}

export const addUsersToProject = async ({ users, projectId, email }) => {
    if (!Array.isArray(users) || users.length === 0) {
        throw new Error("Users must be a non-empty array");
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid projectId");
    }

    const project = await projectModel.findOne({ _id: projectId, users: email });
    console.log("line 56 service", project);

    if (!project) {
        throw new Error("Project not found or user is not authenticated");
    }

    // Convert user IDs to ObjectId and filter unique ones
    const newUsers = users
        .filter(user => user !== email && !project.users.includes(user));
    console.log("line 62 service", newUsers);

    // if (newUsers.length === 0) {
    //     throw new Error("All users are already added to the project");
    // }

    // Use $addToSet to ensure only unique users are added
    await projectModel.updateOne(
        { _id: projectId },
        { $addToSet: { users: { $each: newUsers } } }
    );

    console.log("line 69 service");
    return await projectModel.findById(projectId); // Return updated project
};



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