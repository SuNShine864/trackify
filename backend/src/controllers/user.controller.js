import {asyncHandler} from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import {ApiError} from "../utils/ApiError.js" 
import {User} from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";
const generateAccessAndRefreshTokens=async(userId)=>{
    try {
        const user=await User.findById(userId)
        const accessToken= user.generateAccessToken()
        const refreshToken=user.generateRefreshToken()
        user.refreshToken=refreshToken
        await user.save({validateBeforeSave:false})
        return {accessToken,refreshToken}
    } catch (error) {
        console.error(error);
        throw new ApiError(500,"Something went wrong while generating access and refresh tokens")
    }
}
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
const loginUser=asyncHandler(async(req,res)=>{
    //get details from user
    //enter password
    //check if user exists with this email or username and if password matches
    //is password correct
    //generate accesstoken and refreshtoken
    //store accesstoken in user cookies
    //store refreshtoken in user database
    // give response that user has login successfully

    const {username,email,password}=req.body;
    if(!email){
        throw new ApiError(400,"User details are missing")
    }
    if(!password){
        throw new ApiError(400,"Password is required.")
    }
    const user=await User.findOne({email});
    if(!user){
        throw new ApiError(400,"Invalid user")
    }
    const isMatch=await user.isPasswordCorrect(password);
    if(!isMatch){
        throw new ApiError(401,"Invalid Credentials")
    }
    const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
    const loggedInUser=await User.findById(user._id).select("-password -refreshToken")
    const options={
        httpOnly:true,
        secure:false,
        sameSite: "lax"
    }
    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
        new ApiResponse(
            200,
            {
                user:loggedInUser,accessToken,refreshToken
            },
            "User logged in successfully"
        )
    )
})
const logoutUser=asyncHandler(async(req,res)=>{
    //remove cookies
    //change refreshtoken in user database
    User.findByIdAndUpdate(
        req.user._id,
        {
            $set:{
                refreshToken:undefined
            }
        },
        {
            new:true
        }
    )
    const options={
        httpOnly:true,
        secure:false,
        sameSite: "lax"
    }
    return res
    .status(200)
    .clearCookie("accessToken",options)
    .clearCookie("refreshToken",options)
    .json(new ApiResponse(200,{},"User Logged Out"))
})
const refreshAccessToken=asyncHandler(async(req,res)=>{
    try{
        const incomingRefreshToken=req.cookies.refreshToken||req.body.refreshToken
        if(!incomingRefreshToken){
            throw new ApiError(401,"Unauthorized Request")
        }
        const decodedToken=jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET
        )
        const user=await User.findById(decodedToken?._id)
        if(!user){
            throw new ApiError(401,"Invalid Refresh token")
        }
        if(incomingRefreshToken!==user?.refreshToken){
            throw new ApiError(401,"Refresh Token is expired or used")
        }
        const options={
            httpOnly:true,
            secure:false,
            sameSite: "lax"
        }
        const {accessToken,newrefreshToken}=await generateAccessAndRefreshTokens(user._id)
        return res
        .status(200)
        .cookie("accessToken",accessToken,options)
        .cookie("refreshToken",newrefreshToken,options)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshToken:newrefreshToken},
                "Access Token Refreshed"
            )
        )
    }catch(error){
        throw new ApiError(401,error?.message||"Invalid Refresh token")
    }
})
const changeCurrentPassword=asyncHandler(async(req,res)=>{
    const {oldPassword,newPassword,confirmPassword}=req.body
    if(!(newPassword==confirmPassword)){
        throw new ApiError(409,"Passwords do not match")
    }
    const user=await User.findById(req.user?.id)
    const isPasswordCorrect=await user.isPasswordCorrect(oldPassword)
    if(!isPasswordCorrect){
        throw new ApiError(400,"Invalid old password")
    }
    user.password=newPassword
    await user.save({validateBeforeSave:false})
    return res
    .status(200)
    .json(new ApiResponse(200,{},"Password changed successfully"))
})
export {registerUser,loginUser,logoutUser,refreshAccessToken,changeCurrentPassword}