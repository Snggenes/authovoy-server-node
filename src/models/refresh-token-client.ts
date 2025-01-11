import mongoose from "mongoose";

type TRefreshTokenClient = {
  _id: string;
  token: string;
  clientId: string;
  deviceId: string | null;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  replacedByToken: string | null;
  ipAddress: string | null;
  userAgent: string | null;
};

const refreshTokenClientSchema = new mongoose.Schema<TRefreshTokenClient>(
  {
    token: { type: String, required: true, unique: true },
    clientId: { type: String, required: true },
    deviceId: { type: String, default: null },
    issuedAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    revokedAt: { type: Date, default: null },
    replacedByToken: { type: String, default: null },
    ipAddress: { type: String, default: null },
    userAgent: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

refreshTokenClientSchema.index({ clientId: 1 });
refreshTokenClientSchema.index({ deviceId: 1 });

const RefreshTokenClientModel = mongoose.model<TRefreshTokenClient>(
  "RefreshTokenClient",
  refreshTokenClientSchema
);

export default RefreshTokenClientModel;
