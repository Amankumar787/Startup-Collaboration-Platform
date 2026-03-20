// src/modules/users/user.model.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const SocialLinksSchema = new mongoose.Schema(
  {
    github:   { type: String, default: "" },
    linkedin: { type: String, default: "" },
    portfolio:{ type: String, default: "" },
    twitter:  { type: String, default: "" },
  },
  { _id: false }
);

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,           // Never returned in queries by default
    },

    role: {
      type: String,
      enum: {
        values: ["founder", "developer"],
        message: "Role must be either founder or developer",
      },
      required: [true, "Role is required"],
    },

    skills: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.length <= 20,
        message: "Cannot have more than 20 skills",
      },
    },

    bio: {
      type: String,
      maxlength: [500, "Bio cannot exceed 500 characters"],
      default: "",
    },

    profileImage: {
      url:       { type: String, default: "" },
      publicId:  { type: String, default: "" },  // Cloudinary public_id
    },

    socialLinks: {
      type: SocialLinksSchema,
      default: () => ({}),
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    lastSeen: {
      type: Date,
      default: Date.now,
    },

    // For password reset flow
    passwordResetToken:   { type: String, select: false },
    passwordResetExpires: { type: Date,   select: false },
  },
  {
    timestamps: true,         // createdAt, updatedAt auto-managed
    toJSON:     { virtuals: true },
    toObject:   { virtuals: true },
  }
);

// ─── Indexes ──────────────────────────────────────────────────────────────────
//UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ role: 1 });
UserSchema.index({ skills: 1 });                  // For skill-based search
UserSchema.index({ createdAt: -1 });

// ─── Virtual: Full profile URL ────────────────────────────────────────────────
UserSchema.virtual("profileUrl").get(function () {
  return `/users/${this._id}`;
});

// ─── Pre-save: Hash password ──────────────────────────────────────────────────
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── Instance Method: Compare password ───────────────────────────────────────
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// ─── Instance Method: Safe public profile ────────────────────────────────────
UserSchema.methods.toPublicProfile = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  delete obj.__v;
  return obj;
};

const User = mongoose.model("User", UserSchema);
export default User;