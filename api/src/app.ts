import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { logging } from "./middlewares/logging";
import { verifyToken } from "./middlewares/permissions";
import { authenticateOperator } from "./middlewares/auth";
import accessRouter from "./routes/accessRouter";
import deviceRouter from "./routes/deviceRouter";
import lobbyCalendarRouter from "./routes/lobbyCalendarRouter";
import lobbyProblemRouter from "./routes/lobbyProblemRouter";
import lobbyRouter from "./routes/lobbyRouter";
import memberRouter from "./routes/memberRouter";
import operatorRouter from "./routes/operatorRouter";
import schedulingRouter from "./routes/schedulingRouter";
import tagRouter from "./routes/tagRouter";
import telephoneRouter from "./routes/telephoneRouter";
import vehicleRouter from "./routes/vehicleRouter";
import visitorRouter from "./routes/visitorRouter";
import loggingRouter from "./routes/loggingRouter";
import feedbackRouter from "./routes/feedbackRouter";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (request: Request, response: Response) => {
  response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});

app.post("/auth", authenticateOperator);

app.use(verifyToken, logging);
// app.use();

app.use("/operator", operatorRouter);
app.use("/access", accessRouter);
app.use("/device", deviceRouter);
app.use("/feedback", feedbackRouter);
app.use("/lobby", lobbyRouter);
app.use("/lobbyCalendar", lobbyCalendarRouter);
app.use("/lobbyProblem", lobbyProblemRouter);
app.use("/log", loggingRouter);
app.use("/member", memberRouter);
app.use("/scheduling", schedulingRouter);
app.use("/tag", tagRouter);
app.use("/telephone", telephoneRouter);
app.use("/vehicle", vehicleRouter);
app.use("/visitor", visitorRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: "Algo deu errado!", details: err.message });
});

const port = process.env.PORT || 3333;
app.listen(port, () => {
  console.log(`✨ Servidor rodando na porta ${port} ✨`);
});
