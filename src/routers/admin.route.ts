import { Router } from "express";
import {
  renderSwitchPage,
  switchGateway,
  debugSignGlobalPay,
} from "../controllers/admin.controller";

const adminRouter = Router();

adminRouter.get("/gateway/switch", renderSwitchPage);
adminRouter.post("/gateway/switch", switchGateway);
adminRouter.post("/debug/globalpay/sign", debugSignGlobalPay);

export default adminRouter;
