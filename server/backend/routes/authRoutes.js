const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const transporter = require("../mailer");

const router = express.Router();

// ==================== SIGNUP ====================

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Failed to register user",
    });
  }
});

// ==================== LOGIN ====================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    res.status(500).json({
      message: "Failed to login",
    });
  }
});

// ==================== FORGOT PASSWORD ====================

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    if (!email?.trim()) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    });

    // Use the same response for registered and unregistered emails.
    if (!user) {
      return res.status(200).json({
        message:
          "If this email is registered, a password reset link will be sent.",
      });
    }

    // Generate a temporary reset token.
    const resetToken = crypto
      .randomBytes(32)
      .toString("hex");

    user.resetPasswordToken = resetToken;

    // Keep the reset token valid for 15 minutes.
    user.resetPasswordExpires =
      Date.now() + 15 * 60 * 1000;

    await user.save();

    const resetLink =
      `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send the reset link through email.
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Smart Voice Manager - Password Reset",
      text: `Click this link to reset your password: ${resetLink}`,
    });

    res.status(200).json({
      message:
        "If this email is registered, a password reset link will be sent.",
    });
  } catch (error) {
    console.error(
      "Forgot password error:",
      error
    );

    res.status(500).json({
      message:
        "Unable to process password reset request",
    });
  }
});

// ==================== RESET PASSWORD ====================

router.post(
  "/reset-password/:token",
  async (req, res) => {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;

      if (!newPassword) {
        return res.status(400).json({
          message: "New password is required",
        });
      }

      const user = await User.findOne({
        resetPasswordToken: token,
        resetPasswordExpires: {
          $gt: Date.now(),
        },
      });

      if (!user) {
        return res.status(400).json({
          message: "Invalid or expired reset token",
        });
      }

      const hashedPassword = await bcrypt.hash(
        newPassword,
        10
      );

      user.password = hashedPassword;
      user.resetPasswordToken = null;
      user.resetPasswordExpires = null;

      await user.save();

      res.status(200).json({
        message: "Password reset successful",
      });
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      res.status(500).json({
        message: "Failed to reset password",
      });
    }
  }
);

// ==================== GET PROFILE ====================

router.get(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const user = await User.findById(
        req.user.userId
      ).select("-password");

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message:
          "Protected route accessed successfully",
        user,
      });
    } catch (error) {
      console.error("Profile error:", error);

      res.status(500).json({
        message: "Failed to fetch profile",
      });
    }
  }
);

// ==================== UPDATE PROFILE ====================

router.put(
  "/profile",
  authMiddleware,
  async (req, res) => {
    try {
      const { name, email } = req.body;

      if (!name?.trim() || !email?.trim()) {
        return res.status(400).json({
          message: "Name and email are required",
        });
      }

      const existingUser = await User.findOne({
        email: email.trim().toLowerCase(),
        _id: { $ne: req.user.userId },
      });

      if (existingUser) {
        return res.status(400).json({
          message: "Email already registered",
        });
      }

      const updatedUser =
        await User.findByIdAndUpdate(
          req.user.userId,
          {
            name: name.trim(),
            email: email.trim().toLowerCase(),
          },
          {
            new: true,
            runValidators: true,
          }
        ).select("-password");

      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
      });
    } catch (error) {
      console.error(
        "Profile update error:",
        error
      );

      res.status(500).json({
        message: "Failed to update profile",
      });
    }
  }
);

module.exports = router;