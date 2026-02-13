import User from '../models/User.js';
import mongoose from 'mongoose';

export const createUser = async (req,res,next) => {
    try{
        const user = await User.create(req.body);
        res.status(201).json(user);
    }catch(err){
        next(err);
    }
}

export const getAllUsers = async (req,res,next) => {
    try{
        const users = await User.find({});
        res.status(200).json(users);
    }catch(err){
        next(err);
    }
}


export const getUserById = async (req,res,next) => {
    try{
        const user = await User.findById(req.params.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(err){
        next(err);
    }
}


export const updateUser = async (req,res,next) => {
    try{
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(err){
        next(err);
    }
}


export const deleteUser = async (req,res,next) => {
    try{
        const user = await User.findByIdAndDelete(req.params.id);
        if(!user){
            return res.status(404).json({message: "User not found"});
        }
        res.status(200).json(user);
    }catch(err){
        next(err);
    }
}