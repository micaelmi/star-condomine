"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteLobby = exports.updateLobby = exports.createLobby = exports.getLobby = exports.getFilteredLobbies = exports.getAllLobbies = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllLobbies = async (req, res) => {
    try {
        const lobby = await prisma.lobby.findMany({
            orderBy: [{ name: "asc" }],
        });
        res.json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar as portarias" });
    }
};
exports.getAllLobbies = getAllLobbies;
const getFilteredLobbies = async (req, res) => {
    try {
        const { query } = req.query;
        const whereCondition = query
            ? {
                OR: [
                    { name: { contains: query } },
                    { city: { contains: query } },
                    { state: { contains: query } },
                    {
                        device: {
                            some: { ramal: { equals: parseInt(query) } },
                        },
                    },
                ],
            }
            : {};
        const lobbies = await prisma.lobby.findMany({
            where: whereCondition,
            include: {
                device: true,
                lobbyProblem: true,
            },
            orderBy: [{ name: "asc" }],
        });
        res.json(lobbies);
    }
    catch (error) {
        console.error("Erro na busca da portaria:", error);
        res.status(500).json({ error: "Erro na busca da portaria" });
    }
};
exports.getFilteredLobbies = getFilteredLobbies;
const getLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const lobby = await prisma.lobby.findUniqueOrThrow({
            where: { lobbyId: id },
        });
        if (!lobby) {
            res.status(404).json({ error: "Portaria não encontrada" });
            return;
        }
        res.json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao buscar a portaria" });
    }
};
exports.getLobby = getLobby;
const createLobby = async (req, res) => {
    try {
        const { cnpj, name, responsible, telephone, schedules, exitControl, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, type, } = req.body;
        const lobby = await prisma.lobby.create({
            data: {
                cnpj,
                name,
                responsible,
                telephone,
                schedules,
                exitControl,
                procedures,
                datasheet,
                cep,
                state,
                city,
                neighborhood,
                street,
                number,
                complement,
                type,
            },
        });
        res.status(201).json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao criar a portaria" });
    }
};
exports.createLobby = createLobby;
const updateLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        const { cnpj, name, responsible, telephone, schedules, exitControl, procedures, datasheet, cep, state, city, neighborhood, street, number, complement, type, } = req.body;
        const lobby = await prisma.lobby.update({
            where: { lobbyId: id },
            data: {
                cnpj,
                name,
                responsible,
                telephone,
                schedules,
                exitControl,
                procedures,
                datasheet,
                cep,
                state,
                city,
                neighborhood,
                street,
                number,
                complement,
                type,
            },
        });
        res.status(200).json(lobby);
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao atualizar a portaria" });
    }
};
exports.updateLobby = updateLobby;
const deleteLobby = async (req, res) => {
    try {
        const id = parseInt(req.params.id, 10);
        await prisma.lobby.delete({
            where: { lobbyId: id },
        });
        res.json({ message: "Portaria excluída com sucesso" });
    }
    catch (error) {
        res.status(500).json({ error: "Erro ao excluir a portaria" });
    }
};
exports.deleteLobby = deleteLobby;
