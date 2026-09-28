const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    // Basic Info
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 30,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    // Profile
    firstName: { type: String, trim: true, maxlength: 50 },
    lastName: { type: String, trim: true, maxlength: 50 },
    phone: { type: String, trim: true },
    avatar: { type: String, default: "default-avatar.png" },

    // Role & Permissions (Updated as per Chat Context)
    role: {
      type: String,
      enum: [
        "Super Admin",
        "Admin",
        "Manager",
        "Editor",
        "Support",
        "Customer",
      ],
      default: "Customer",
    },
    permissions: {
      settings: {
        view: { type: Boolean, default: false },
        edit: { type: Boolean, default: false },
        sections: {
          general: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          storeInformation: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          paymentMethods: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          shipping: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          notifications: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          usersAndRoles: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          security: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          apiSettings: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          integrations: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
          appearance: {
            view: { type: Boolean, default: false },
            edit: { type: Boolean, default: false },
          },
        },
      },
    },

    // Security Settings (Two-Factor Auth)
    twoFactorEnabled: { type: Boolean, default: false },

    // Address (Embedded)
    addresses: [
      {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true, default: "Pakistan" },
        isDefault: { type: Boolean, default: false },
      },
    ],

    // Account Status
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },

    // Wishlist
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  },
);

// Password Hashing Middleware
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Password Verification Method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Virtual field for full name
userSchema.virtual("fullName").get(function () {
  return `${this.firstName || ""} ${this.lastName || ""}`.trim();
});

module.exports = mongoose.model("User", userSchema);
