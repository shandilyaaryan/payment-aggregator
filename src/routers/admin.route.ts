import { Router } from "express";
import { renderSwitchPage, switchGateway } from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.get("/gateway/switch", renderSwitchPage);
adminRouter.post("/gateway/switch", switchGateway);

export default adminRouter;
