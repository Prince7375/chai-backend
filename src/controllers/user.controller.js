import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloundnary.js"
import { ApiResponse } from "../utils/ApiResponse.js"


const registerUser = asyncHandler( async (req, res) => {
    // get details from frontend
    //validation - not empty
    // check if user already exists : username, email
    // check for images, check for avatar
    // upload them to cloudinary
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return response

    const {fullname, email, username, password} = req.body // get details from frontend
    console.log("email:", email, "password:", password);

    if ( [fullname, email, username, password].some( (field) => field?.trim() === "")) {  //validation - not empty
        throw new ApiError(400, "All fields are required")
    }

    if (!email.include("@")) {    //validation of email
        throw new ApiError(400, "Invaild Email")
    }

    const existedUser = User.findOne({    // check if user already exists : username, email
        $or: [{ username }, { email }]
    })
    if (existedUser) {
        throw new ApiError(409, "User with email or username already exists")
    }
    
    const avatarLocalPath = req.files?.avatar[0]?.path;     //check for images
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {                                 // check for avatar
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)        // uploading the avatar to the cloudinary
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)     // uploading the coverImage to the cloudinary
    if (!avatarLocalPath) {                                 // check for avatar again
        throw new ApiError(400, "Avatar file is required")
    }

    const user = await User.create({      //creating user object - creating entry in db
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    const createdUser = await User.findById((user._id)).select(         // checking if the user is create in db or not
        "-password -refreshToken"
    ) 
    if(!createdUser) {
        throw new ApiError(500, "Something went worng while registering the user")
    }

    return res.status(201).json(                    //  return response
        new ApiResponse(200, createdUser, "User registerd Successfully")  
    )


})




export {registerUser}