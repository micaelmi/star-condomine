import { Request, Response } from "express";
import prisma from "../db";

export const getAllLobbies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const lobby = await prisma.lobby.findMany({
      orderBy: [{ name: "asc" }],
      include: {
        device: true,
        lobbyProblem: true,
        ControllerBrand: true,
      },
    });
    res.json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar as portarias" });
  }
};

export const getFilteredLobbies = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { query } = req.query;

    const whereCondition = query
      ? {
          OR: [
            { name: { contains: query as string } },
            { city: { contains: query as string } },
            { state: { contains: query as string } },
          ],
        }
      : {};

    const lobbies = await prisma.lobby.findMany({
      where: whereCondition,
      include: {
        device: true,
        lobbyProblem: true,
        ControllerBrand: true,
      },
      orderBy: [{ name: "asc" }],
    });

    res.json(lobbies);
  } catch (error) {
    console.error("Erro na busca da portaria:", error);
    res.status(500).json({ error: "Erro na busca da portaria" });
  }
};

export const getLobby = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const lobby = await prisma.lobby.findUniqueOrThrow({
      where: { lobbyId: id },
      include: {
        ControllerBrand: true,
        device: true,
      },
    });
    if (!lobby) {
      res.status(404).json({ error: "Portaria não encontrada" });
      return;
    }
    res.json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar a portaria" });
  }
};

export const createLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      cnpj,
      name,
      responsible,
      telephone,
      schedules,
      exitControl,
      protection,
      procedures,
      datasheet,
      cep,
      state,
      city,
      neighborhood,
      street,
      number,
      complement,
      code,
      type,
      controllerBrandId,
    } = req.body;
    const lobby = await prisma.lobby.create({
      data: {
        cnpj,
        name,
        responsible,
        telephone,
        schedules,
        exitControl,
        protection,
        procedures,
        datasheet,
        cep,
        state,
        city,
        neighborhood,
        street,
        number,
        complement,
        code,
        type,
        controllerBrandId,
      },
    });
    res.status(201).json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao criar a portaria" });
  }
};

export const updateLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    const {
      cnpj,
      name,
      responsible,
      telephone,
      schedules,
      exitControl,
      protection,
      procedures,
      datasheet,
      cep,
      state,
      city,
      neighborhood,
      street,
      number,
      complement,
      code,
      type,
      controllerBrandId,
    } = req.body;

    const lobby = await prisma.lobby.update({
      where: { lobbyId: id },
      data: {
        cnpj,
        name,
        responsible,
        telephone,
        schedules,
        exitControl,
        protection,
        procedures,
        datasheet,
        cep,
        state,
        city,
        neighborhood,
        street,
        number,
        complement,
        code,
        type,
        controllerBrandId,
      },
    });

    res.status(200).json(lobby);
  } catch (error) {
    res.status(500).json({ error: "Erro ao atualizar a portaria" });
  }
};

export const deleteLobby = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const id = parseInt(req.params.id, 10);
    await prisma.lobby.delete({
      where: { lobbyId: id },
    });
    res.json({ message: "Portaria excluída com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao excluir a portaria" });
  }
};
