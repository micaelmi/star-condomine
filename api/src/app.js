"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const logging_1 = require("./middlewares/logging");
const permissions_1 = require("./middlewares/permissions");
const auth_1 = require("./middlewares/auth");
const accessRouter_1 = __importDefault(require("./routes/accessRouter"));
const deviceRouter_1 = __importDefault(require("./routes/deviceRouter"));
const lobbyCalendarRouter_1 = __importDefault(require("./routes/lobbyCalendarRouter"));
const lobbyProblemRouter_1 = __importDefault(require("./routes/lobbyProblemRouter"));
const lobbyRouter_1 = __importDefault(require("./routes/lobbyRouter"));
const memberRouter_1 = __importDefault(require("./routes/memberRouter"));
const operatorRouter_1 = __importDefault(require("./routes/operatorRouter"));
const schedulingRouter_1 = __importDefault(require("./routes/schedulingRouter"));
const tagRouter_1 = __importDefault(require("./routes/tagRouter"));
const telephoneRouter_1 = __importDefault(require("./routes/telephoneRouter"));
const vehicleRouter_1 = __importDefault(require("./routes/vehicleRouter"));
const visitorRouter_1 = __importDefault(require("./routes/visitorRouter"));
const loggingRouter_1 = __importDefault(require("./routes/loggingRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.get("/", (request, response) => {
    response.json({ message: "API DO SISTEMA STAR CONDOMINE" });
});
app.post("/auth", auth_1.authenticateOperator);
app.use(permissions_1.verifyToken, logging_1.logging);
// app.use();
app.use("/operator", operatorRouter_1.default);
app.use("/access", accessRouter_1.default);
app.use("/device", deviceRouter_1.default);
app.use("/lobby", lobbyRouter_1.default);
app.use("/lobbyCalendar", lobbyCalendarRouter_1.default);
app.use("/lobbyProblem", lobbyProblemRouter_1.default);
app.use("/log", loggingRouter_1.default);
app.use("/member", memberRouter_1.default);
app.use("/scheduling", schedulingRouter_1.default);
app.use("/tag", tagRouter_1.default);
app.use("/telephone", telephoneRouter_1.default);
app.use("/vehicle", vehicleRouter_1.default);
app.use("/visitor", visitorRouter_1.default);
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Algo deu errado!", details: err.message });
});
const port = process.env.PORT || 3333;
app.listen(port, () => {
    console.log(`✨ Servidor rodando na porta ${port} ✨`);
});