"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getActiveSchedulingsByVisitor = exports.getFilteredSchedulings = exports.getSchedulingsByLobby = exports.deleteScheduling = exports.updateScheduling = exports.createScheduling = exports.getScheduling = exports.getAllSchedules = void 0;
const db_1 = __importDefault(require("../db"));
const getAllSchedules = async (req, res) => {
    try {
        const scheduling = await db_1.default.scheduling.findMany();
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os agendamentos" });
    }
};
exports.getAllSchedules = getAllSchedules;
const getScheduling = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const scheduling = await db_1.default.scheduling.findUniqueOrThrow({
            where: { schedulingId: id },
            include: {
                visitor: {
                    select: {
                        name: true,
                        cpf: true,
                        rg: true,
                    },
                },
                member: {
                    select: {
                        name: true,
                        cpf: true,
                        rg: true,
                    },
                },
                operator: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        if (!scheduling) {
            res.status(404).json({ error: "Agendamento não encontrado" });
            return;
        }
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar o agendamento" });
    }
};
exports.getScheduling = getScheduling;
const createScheduling = async (req, res) => {
    try {
        const { reason, location, startDate, endDate, comments, visitorId, lobbyId, memberId, operatorId, } = req.body;
        const scheduling = await db_1.default.scheduling.create({
            data: {
                reason,
                location,
                startDate,
                endDate,
                comments,
                visitorId,
                lobbyId,
                memberId,
                operatorId,
            },
        });
        res.status(201).json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar o agendamento" });
    }
};
exports.createScheduling = createScheduling;
const updateScheduling = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { reason, location, startDate, endDate, comments, status, visitorId, lobbyId, memberId, operatorId, } = req.body;
        const scheduling = await db_1.default.scheduling.update({
            where: { schedulingId: id },
            data: {
                reason,
                location,
                startDate,
                endDate,
                comments,
                status,
                visitorId,
                lobbyId,
                memberId,
                operatorId,
            },
        });
        res.status(200).json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar o agendamento" });
    }
};
exports.updateScheduling = updateScheduling;
const deleteScheduling = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await db_1.default.scheduling.delete({
            where: { schedulingId: id },
        });
        res.json({ message: "Agendamento excluído com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir o agendamento" });
    }
};
exports.deleteScheduling = deleteScheduling;
const getSchedulingsByLobby = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const scheduling = await db_1.default.scheduling.findMany({
            where: { lobbyId: lobby },
            include: {
                visitor: {
                    select: {
                        name: true,
                        cpf: true,
                        rg: true,
                    },
                },
                member: {
                    select: {
                        name: true,
                        cpf: true,
                        rg: true,
                    },
                },
            },
            orderBy: [{ status: "asc" }, { endDate: "desc" }, { startDate: "desc" }],
        });
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getSchedulingsByLobby = getSchedulingsByLobby;
const getFilteredSchedulings = async (req, res) => {
    try {
        const lobby = parseInt(req.params.lobby, 10);
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { visitor: { name: { contains: query } } },
                    { member: { name: { contains: query } } },
                ],
                AND: { lobbyId: lobby },
            }
            : {};
        const scheduling = await db_1.default.scheduling.findMany({
            where: whereCondition,
            include: {
                visitor: {
                    select: {
                        name: true,
                        cpf: true,
                        rg: true,
                    },
                },
                member: {
                    select: {
                        name: true,
                        cpf: true,
                        rg: true,
                    },
                },
            },
            orderBy: [{ status: "asc" }, { endDate: "asc" }, { startDate: "desc" }],
        });
        if (!scheduling) {
            res.status(404).json({ error: "Nenhum acesso encontrado" });
            return;
        }
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os acessos" });
    }
};
exports.getFilteredSchedulings = getFilteredSchedulings;
const getActiveSchedulingsByVisitor = async (req, res) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
        const visitor = parseInt(req.params.visitor, 10);
        const scheduling = await db_1.default.scheduling.findMany({
            where: { visitorId: visitor, status: "ACTIVE", endDate: { gte: today } },
        });
        res.json(scheduling);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar os agendamentos" });
    }
};
exports.getActiveSchedulingsByVisitor = getActiveSchedulingsByVisitor;
