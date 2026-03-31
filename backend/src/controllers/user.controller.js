import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js" 
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../../../../backend practice/backend/src/utils/cloudinary.js";
const registerUser=asyncHandler(async(req,res)=>{
    //receive details from user
    //check if required details are passed
    //check for avatar
    //check if user already exists
    //upload all images on cloudinary
    //store them in database
    //remove password and refresh token from response
    //check for user creation
    //return response
    const {email,username,password}=req.body;
    if(!username ||! email || !password){
        console.log("all fields are required")
        throw new ApiError(400,"All fields are required")
    }
    const existedUser=await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser){
        throw new ApiError(409,"User already exists")
    }
    const avatarLocalPath=req.files?.avatar?.[0]?.path
    
    const avatar=await uploadOnCloudinary(avatarLocalPath)
    
    const user = await User.create({
        username:username.toLowerCase(),
        email,
        password,
        avatar:avatar?.url || ""
    })
    const createdUser= await User.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createdUser){
        throw new ApiError(500,"Faced problem in registering the user")
    }
    return res.status(200).json(
        new ApiResponse(200,createdUser, "User is registered Successfully")
    )

    
})

export {registerUser}