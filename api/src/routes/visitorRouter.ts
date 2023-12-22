import express from "express";
import {
  createVisitor,
  getAllVisitors,
  getVisitor,
  updateVisitor,
  deleteVisitor,
  getVisitorTypes,
  getVisitorsByLobby,
  getFilteredVisitors,
} from "../controllers/visitor";
import { checkAdminPermission } from "../middlewares/permissions";

const visitorRouter = express.Router();

visitorRouter.get("/", getAllVisitors);
visitorRouter.get("/find/:id", getVisitor);
visitorRouter.get("/types", getVisitorTypes);
visitorRouter.get("/lobby/:lobby", getVisitorsByLobby);
visitorRouter.get("/filtered/:lobby", getFilteredVisitors);
visitorRouter.post("/", createVisitor);
visitorRouter.put("/:id", updateVisitor);
visitorRouter.delete("/:id", checkAdminPermission, deleteVisitor);

export default visitorRouter;
