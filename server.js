import http, { createServer } from 'http';
import dotenv from 'dotenv';
import express from 'express'
import app from './app.js';
import { create } from 'domain';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken'
import mongoose from 'mongoose';
import projectModel from './models/project.model.js'
import { generateResult } from './services/ai.service.js';


dotenv.config();
const port = process.env.PORT;

const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: '*' }
});

io.use(async (socket, next) => {
    try {
        const token = socket.handshake.auth?.token || socket.handshake.headers.authorization?.split(' ')[1];
        const projectId = socket.handshake.query?.projectId;

        if (!projectId) {
            return next(new Error("Project ID is missing"));
        }
        
        const project = await projectModel.findById(projectId);
        if (!project) {
            return next(new Error("Invalid project ID"));
        }

        socket.projectId = projectId; // Store projectId directly on socket
        
        if (!token) {
            return next(new Error("Authentication error"));
        }
        
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) return next(new Error("Authentication error"));
            socket.user = decoded;
            next();
        });

    } catch (err) {
        console.log("Socket Auth Error:", err);
        next(err);
    }
});

io.on('connection', (socket) => {
    console.log('A user connected', socket.projectId);
    
    socket.join(socket.projectId); // Ensure user joins the correct room
    
    socket.on('join-project', async (projectId) => {
        try {
            const project = await projectModel.findById(projectId);
            if (!project) {
                socket.emit('error', 'Project not found');
                return;
            }
            
            socket.join(projectId);
            console.log(`User joined project room: ${projectId}`);
            socket.emit('joined-project', project);
        } catch (error) {
            socket.emit('error', 'Error joining project');
        }
    });

    socket.on('project-message', async(data) => {
        console.log("Received project-message:", data);
        
        if (!data.projectId) {
            console.error("Error: Missing projectId in message data");
            return;
        }
         const message = data.message
         const aiIsPresendInMessage = message.includes('@ai');
        io.to(data.projectId).emit('project-message', data); // Send to all clients in the room
        if(aiIsPresendInMessage){
            const prompt = message.replace('@ai','');
            const result = await generateResult(prompt);

            io.to(data.projectId).emit('project-message', {
               sender: 'Ai',
               message: result // Question first, new line, then result
           });
           

           return;
        }
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
        socket.leave(socket.projectId); // Remove user from the room
    });
});

server.listen(port, () => {
    console.log(`Server is live on port ${port}`);
});