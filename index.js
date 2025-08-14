import e from "express";
import appRouter from "./routes/index.js";
import "dotenv/config";
import mongoose from "mongoose";

const port = process.env.PORT || 8080;

const app = e();

mongoose.connect(process.env.MONGO_URL).then(() => {
  app.listen(port, "0.0.0", () => {
    console.log(`Listening to port ${port}`);
  });
});
app.use(e.json());
app.use(appRouter);


