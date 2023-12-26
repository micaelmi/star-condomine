import express from "express";
import {
  createScheduling,
  getAllSchedules,
  getScheduling,
  updateScheduling,
  deleteScheduling,
  getFilteredSchedulings,
  getSchedulingsByLobby,
} from "../controllers/scheduling";
import { checkAdminPermission } from "../middlewares/permissions";

const schedulingRouter = express.Router();

schedulingRouter.get("/", getAllSchedules);
schedulingRouter.get("/find/:id", getScheduling);
schedulingRouter.get("/lobby/:lobby", getSchedulingsByLobby);
schedulingRouter.get("/filtered/:lobby", getFilteredSchedulings);
schedulingRouter.post("/", createScheduling);
schedulingRouter.put("/:id", updateScheduling);
schedulingRouter.delete("/:id", checkAdminPermission, deleteScheduling);

export default schedulingRouter;
