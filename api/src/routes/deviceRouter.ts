import express from "express";
import {
  createDevice,
  getAllDevices,
  getDevice,
  updateDevice,
  deleteDevice,
  getDeviceModels,
  getDeviceByLobby,
  getFilteredDevices,
} from "../controllers/device";
import { checkAdminPermission } from "../middlewares/permissions";

const deviceRouter = express.Router();

deviceRouter.get("/", getAllDevices);
deviceRouter.get("/find/:id", getDevice);
deviceRouter.post("/", createDevice);
deviceRouter.put("/:id", updateDevice);
deviceRouter.delete("/:id", checkAdminPermission, deleteDevice);
deviceRouter.get("/models", getDeviceModels);
deviceRouter.get("/lobby/:lobby", getDeviceByLobby);
deviceRouter.get("/filtered/:lobby", getFilteredDevices);

export default deviceRouter;
