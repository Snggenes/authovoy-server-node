import mongoose, { CallbackError } from "mongoose";
import bcrypt from "bcrypt";

export type TClient = {
  _id: string;
  status: string;
  picture: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  passwordHash: string | null;
  isEmailVerified: boolean;
  emailVerificationNumber: number | null;
  emailVerificationNumberExpires: Date | null;
  passwordResetToken: string | null;
  passwordResetTokenExpires: Date | null;
  lastLoginAt: Date | null;
  lastLoginIp: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};

const clientSchema = new mongoose.Schema<TClient>(
  {
    status: {
      type: String,
      enum: ["active", "suspended", "deleted"],
      default: "active",
    },
    picture: { type: String, default: null },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, default: null },
    isEmailVerified: { type: Boolean, default: false },
    emailVerificationNumber: { type: Number, default: null },
    emailVerificationNumberExpires: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpires: { type: Date, default: null },
    lastLoginAt: { type: Date, default: null },
    lastLoginIp: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

// clientSchema.pre("save", async function (next) {
//   try {
//     if (this.isModified("passwordHash") && this.passwordHash) {
//       const salt = await bcrypt.genSalt(10);
//       this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
//     }
//     next();
//   } catch (error) {
//     next(error as CallbackError);
//   }
// });

// clientSchema.methods.comparePassword = async function (
//   password: string
// ): Promise<boolean> {
//   if (!this.passwordHash) {
//     throw new Error("Password not set for this client");
//   }
//   const isMatch = await bcrypt.compare(password, this.passwordHash);
//   return isMatch;
// };

const ClientModel = mongoose.model<TClient>("Client", clientSchema);

export default ClientModel;
