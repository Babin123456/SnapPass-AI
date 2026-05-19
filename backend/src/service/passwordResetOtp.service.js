/**
 * @description Service layer for handling password reset OTP generation, storage, and verification. This module interacts with the PasswordResetOtp DAO to manage OTPs and implements the business logic for password reset functionality.
 * @use This service is used in the password reset flow to create OTPs, verify them, and update their state as needed.
 */

import { createPasswordResetOtp, findValidOtp, updateOtpState } from "../dao/passwordResetOtp.dao.js";
import { generateOTP } from "../utils/generateOTP.js";
import AppError from "../utils/errors/AppError.js";
import NotFoundError from "../utils/errors/NotFoundError.js";

export async function generateAndStoreOtp(userId) {
    const otp = generateOTP();
    const passwordResetOtp = await createPasswordResetOtp(userId, otp);
    return passwordResetOtp;
}

export async function checkOtpValidity(userId, otp) {
    const validOtp = await findValidOtp(userId, otp);
    if (!validOtp) {
        throw new AppError("Invalid or expired OTP", 400);
    }
    return validOtp;
}

export async function verifyOtp(userId, otp) {
    const validOtp = await findValidOtp(userId, otp);
    if (!validOtp) {
        throw new AppError("Invalid or expired OTP", 400);
    }
    return await updateOtpState(validOtp._id, "resolve"); // Changed from "resolved" to "resolve" to match the MongoDB schema enum
}