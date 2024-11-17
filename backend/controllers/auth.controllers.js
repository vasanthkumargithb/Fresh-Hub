import { User } from "../models/User.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookies.js";
import { sendVerification, sendWelcomeEmail, sendResetEmail, sendResetSuccessEmail } from '../mailtrap/emails.js'

// singup
export const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        if (!email || !password || !name) {
            throw new Error("All feilds are required!")
        }

        const userAlreadyExist = await User.findOne({ email });

        if (userAlreadyExist) {
            return res.status(409).json({ success: false, message: "user already exist!" });

        }

        const hashPassword = await bcrypt.hash(password, 10);

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const user = new User({
            email,
            password: hashPassword,
            name,
            verificationToken,
            verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000  //24 hours
        })

        await user.save();
        generateTokenAndSetCookie(res, user._id);

        sendVerification(verificationToken, user.email)

        res.status(201).json({
            success: true, message: "user created successfully!",
            user: {
                ...user._doc,
                password: undefined
            }
        })
        console.log("user registered!")
    } catch (error) {
        console.log("error in registring user!")
        res.status(400).json({ success: false, message: "error in creating user!" });
    }

}

//verifying email through verification code 
export const verifyEmail = async (req, res) => {

    const { code } = req.body;
    console.log(code)
    try {
        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        })


        if (!user) {
            return res.status(400).json({ success: false, message: "You verification code is expired!" });
        }

        user.isVerified = true;  //set isVerified  to true;

        user.verificationToken = undefined;  //delete verificationtoken as it is used to verify the user
        user.verificationTokenExpiresAt = undefined; //delete verificationTokenExpiresAt as it is used to verify the user
        await user.save();

        await sendWelcomeEmail(user.name, user.email); //send welcome email after verifying

        res.status(200).json({
            success: true,
            message: "User verified and created successfully!",
            user: {
                ...user._doc,
                password: undefined,
            }
        })
        console.log("email verified!")

    } catch (error) {
        console.log("error in verification :", error);
        return res.status(500).json({ success: false, message: "error in verifying user!", error })
    }

}

// singin
export const signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid credientials!" })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credientials!" })

        }

        generateTokenAndSetCookie(res, user._id);
        user.lastLogin = new Date();
        await user.save();

        res.status(200).json({
            success: true,
            message: "successfully signed in!",
            user: {
                ...user._doc,
                password: undefined
            }
        })
        console.log("singed in!")
    } catch (error) {
        console.log("error in login!", error)
        res.status(400).json({ success: false, message: "error in singing you inn!" })
    }
}

//logout
export const logout = async (req, res) => {
    try {
      // Clear the cookie named 'token'
      res.clearCookie("token", {
        httpOnly: true,  // Match with the original cookie options
        secure: process.env.NODE_ENV === "production", // Secure in production
        sameSite: "strict",  // Prevent cross-site cookie usage
        path: "/", // Ensure it matches the path used when the cookie was set
      });
  
      // Respond with success
      res.status(200).json({
        success: true,
        message: "Logged out successfully",
      });
  
      // Optional server-side logging
      console.log("User logged out successfully");
    } catch (error) {
      // Handle potential errors
      console.error("Logout error:", error);
      res.status(500).json({
        success: false,
        message: "Logout failed. Please try again.",
      });
    }
  };
  

    //forgotpassword
    export const forgotPassword = async (req, res) => {
        const { email } = req.body;

        try {

            const user = await User.findOne({ email });

            if (!user) {
                console.log("you are good to come!")
                res.status(400).json({ success: false, message: "Invalid email!" })
            }

            const resetToken = crypto.randomBytes(20).toString("hex")
            const resteTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000 // 1 hour

            user.resetPasswordToken = resetToken;
            user.resetPasswordExpiresAt = resteTokenExpiresAt;

            await user.save();
            sendResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

            return res.status(200).json({ success: true, message: "Password reset link is sent successfully!" })

        } catch (error) {
            res.status(400).json({ success: false, message: "error in sending reset link!" })
        }

    }

    //this function resets password and save it to database
    export const resetPassword = async (req, res) => {
        try {
            const { token } = req.params;
            const { password } = req.body;

            const user = await User.findOne({
                resetPasswordToken: token,
                resetPasswordExpiresAt: { $gt: Date.now() },
            });

            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
            }

            // update password
            const hashedPassword = await bcrypt.hash(password, 10);

            user.password = hashedPassword;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpiresAt = undefined;
            await user.save();

            await sendResetSuccessEmail(user.email);
            console.log("done!")

            res.status(200).json({ success: true, message: "Password reset successful" });
        } catch (error) {
            console.log("Error in resetPassword ", error);
            res.status(400).json({ success: false, message: error.message });
        }
    };

    export const checkAuth = async (req, res) => {

        try {
            const user = await User.findById(req.userId).select("-password")
            if (!user) return res.status(400).json({ success: false, message: "user not found!" })

            res.status(200).json({ success: true, user })
        } catch (error) {
            console.log("error ", error)
            return res.status(400).json({ success: false, message: "error in verifying user!" })
        }

    }
