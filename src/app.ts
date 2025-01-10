import express from "express";
import cookieparser from "cookie-parser";
import helmet from "helmet";
import customCors from "./middlewares/custom-cors";

const app = express();

app.use(customCors);

app.use(express.json());
app.use(cookieparser());
app.use(helmet());
app.use(express.urlencoded({ extended: true }));

app.get("/api", (req, res) => {
  res.json({ message: "Hello Worlddd" });
});

export default app;
