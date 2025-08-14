import { Router } from "express";
import exotelRoutes from "./exotelRoutes.js";

const appRouter = Router();


appRouter.use("/exotel",exotelRoutes);

export default appRouter;

