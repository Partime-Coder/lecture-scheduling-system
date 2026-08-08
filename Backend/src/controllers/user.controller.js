import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js'
import { apiResponse } from '../utils/apiResponse.js'
import { User } from '../models/users.model.js';
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };

    } catch (error) {
        throw new apiError(500, "Something went wrong while generating access and refresh token!")
    }
};

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || email.trim() === "") {
        throw new apiError(400, "Email is required");
    };
    if (!password || password.trim() === "") {
        throw new apiError(400, "Password is required");
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        throw new apiError(400, "please enter valid emailId");
    };
    if (password.length < 8 || password.length > 25) {
        throw new apiError(400, "Password length must be more then 8 or less then 25");
    };
    const user = await User.findOne({ email });
    if (!user) {
        throw new apiError(404, "User does not found!");
    };
    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) {
        throw new apiError(401, "Invalid user credentials");
    };
     const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);
    const loggedInUser = await User.findById(user._id)
        .select("-password -refreshToken");

    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new apiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged In Successfully"
            )
        );
});

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(req.user._id,
        {
            $set: {
                refreshToken: undefined
            },
        },
        {
            new: true
        },
    );
    const options = {
        httpOnly: true,
        secure: true,
    };

    return res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"))

});

const getCurrentUser = asyncHandler(async (req, res) => {
    return res.status(200)
        .json(
            new apiResponse(200, req.user, "Current user fetched successfully!")
        );
});

const getAllInstructors = asyncHandler(async (req, res) => {
    const instructors = await User.find({
        role: "instructor"
    })
    .select("-password -refreshToken");


    return res.status(200)
        .json(
            new apiResponse(
                200,
                instructors,
                "Instructors fetched successfully"
            )
        );
});

const refreshAccessToken = asyncHandler(async (req, res) => {

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
        throw new apiError(401, "Unauthorized Request!");
    };
    try {
        const decodedToken = jwt.verify(
            incomingRefreshToken,
            process.env.REFRESH_TOKEN_SECRET,
        );
        const user = await User.findById(decodedToken?._id);
        if (!user) {
            throw new apiError(401, "Invalid refresh token!");
        };
        if (incomingRefreshToken !== user?.refreshToken) {
            throw new apiError(401, "Refresh token is expired or used!");
        };
        const options = {
            httpOnly: true,
            secure: true,
        };
        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

        return res.status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", refreshToken, options)
            .json(
                new apiResponse(
                    200,
                    {
                        accessToken, refreshToken
                    },
                    "Access token refresh successfully!"
                )
            )
    } catch (error) {
        throw new apiError(401, error?.message || "Invalid Refresh Token!");
    };
});

export {
    loginUser,
    logoutUser,
    getCurrentUser,
    getAllInstructors,
    refreshAccessToken,
};