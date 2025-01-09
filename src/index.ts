import "dotenv/config";

import http from "http";
import app from "./app";
import mongoose from "mongoose";

mongoose.connect(process.env.MONGO_URI!);
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err) => {
  console.error("Error connecting to MongoDB: ", err);
});

const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

console.log(process.env.NODE_ENV);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
