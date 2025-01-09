import ClientModel from "../models/client";

declare global {
  namespace Express {
    interface Request {
      client: ClientModel | null;
    }
  }
}
