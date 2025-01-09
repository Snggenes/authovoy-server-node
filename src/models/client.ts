import mongoose from "mongoose";

type TClient = {
  picture: string | null;
  firstName: string | null;
  lastName: string | null;
  email: string;
  passwordhash: string | null;
  isEmailVerified: boolean;
  emailVerificationNumber: number | null;
  emailVerificationNumberExpires: Date | null;
};

const clientSchema = new mongoose.Schema<TClient>({
  picture: { type: String, default: null },
  firstName: { type: String, default: null },
  lastName: { type: String, default: null },
  email: { type: String, required: true },
  passwordhash: { type: String, default: null },
  isEmailVerified: { type: Boolean, default: false },
  emailVerificationNumber: { type: Number, default: null },
  emailVerificationNumberExpires: { type: Date, default: null },
});

const ClientModel = mongoose.model<TClient>("Client", clientSchema);

export default ClientModel;
