import { validationResult } from 'express-validator';
import * as aiService from '../services/ai.service.js';


export const generateResult = async(req, res)=>{
    const errors= validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors:errors.array(),
        })
    }

    const {prompt} = req.query;
    const result = await aiService.generateResult(prompt);
    res.status(200).json({
        result:result
    })
}