import { error } from "console";
import { Pedido, Estado } from "../models/Pedido";
import { pedidoRepository } from "./../repositories/PedidoRepository";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";

import fs from "fs";

export class PedidoController {
  async createPedido(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new Error("Não autorizado");
      }

      // Verificando se o token existe e obtendo o ID do usuário
      const token = authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
        id: number;
      };
      const { id } = decodedToken;

      // Dados do pedido
      const {
        material,
        maquina,
        cor,
        descricao,
        comentario,
        id_horaDisponivel,
        prioridade,
      } = req.body;

      let estado: Estado = Estado.pendente;
      let arquivo: Buffer | undefined;

      if (req.file) {
        arquivo = fs.readFileSync(req.file.path);
      }

      const pedido = new Pedido(
        material,
        prioridade,
        maquina,
        estado,
        arquivo || Buffer.alloc(0), // Verificação adicional para garantir que arquivo seja um Buffer
        cor,
        descricao,
        comentario,
        Number(id_horaDisponivel),
        id,
        null
      );

      const novoPedido = pedidoRepository.create(pedido);

      await pedidoRepository.save(novoPedido);

      return res.status(201).json(novoPedido);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o pedido" });
    }
  }
  async getPedidosByUsuario(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new Error("Não autorizado");
      }

      // Verificando se o token existe e obtendo o ID do usuário
      const token = authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
        id: number;
      };
      const { id } = decodedToken;
      console.log(id);

      // Obtendo os pedidos vinculados ao usuário logado
      const pedidos = await pedidoRepository
        .createQueryBuilder("pedido")
        .where("pedido.id_autorPedido = :id_autorPedido", {
          id_autorPedido: id,
        })
        .getMany();

      return res.status(200).json(pedidos);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o pedido anônimo" });
    }
  }

  async updatePedido(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      const { id_pedido } = req.params;
  
      if (!authorization) {
        throw new Error("Não autorizado");
      }
  
      // Verificando se o token existe e obtendo o ID do usuário
      const token = authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
        id: number;
      };
      const { id } = decodedToken;
  
      // Verificar se o pedido pertence ao autor
      const pedido = await pedidoRepository.findOne({
        where: { id_pedido: parseInt(id_pedido), id_autorPedido: id },
      });
  
      if (!pedido) {
        throw new Error("Pedido não encontrado ou não autorizado");
      }
  
      // Atualizar os dados do pedido
      const {
        material,
        maquina,
        cor,
        descricao,
        comentario,
        id_horaDisponivel,
        prioridade,
      } = req.body;
  
      let arquivo: Buffer | undefined;
  
      if (req.file) {
        arquivo = fs.readFileSync(req.file.path);
      }
  
      pedido.material = material || material;
      pedido.maquina = maquina || maquina;
      pedido.cor = cor || cor;
      pedido.descricao = descricao || descricao;
      pedido.comentario = comentario || comentario;
      pedido.id_horaDisponivel = Number(id_horaDisponivel) || id_horaDisponivel;
      pedido.prioridade = prioridade || prioridade;
      pedido.arquivo = arquivo || Buffer.alloc(0); // Verificação adicional para garantir que arquivo seja um Buffer
  
      await pedidoRepository.save(pedido);
  
      return res.status(200).json(pedido);
    } catch (error) {
      console.log(error)
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao atualizar o pedido" });
    }
  }
  
  async deletePedido(req: Request, res: Response) {
    const { authorization } = req.headers;
    const { id_pedido } = req.params;

    if (!authorization) {
      throw new Error("Não autorizado");
    }

    // Verificando se o token existe e obtendo o ID do usuário
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
      id: number;
    };
    const { id } = decodedToken;

    try {
      const result = await pedidoRepository.delete({
        id_pedido: parseInt(id_pedido),
        id_autorPedido: id,
      });

      if (result.affected === 0) {
        throw new Error("Pedido não encontrado ou não autorizado");
      }

      return res.status(202).json("Pedido deletado");
    } catch (error) {
      throw new Error("Ocorreu um erro ao excluir o pedido");
    }
  }

  async getPedidosByEstado(req: Request, res: Response) {
    const { estado } = req.params;
    const { authorization } = req.headers;

    if (!authorization) {
      throw new Error("Não autorizado");
    }

    // Verificando se o token existe e obtendo o ID do usuário
    const token = authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
      id: number;
    };
    const { id } = decodedToken;

    try {
      // Verifique se o estado fornecido é válido
      const estadoEnum = Object.values(Estado).find(
        (enumEstado) => enumEstado.toLowerCase() === estado.toLowerCase()
      );

      if (!estadoEnum) {
        throw new Error("Estado inválido");
      }

      const pedidos = await pedidoRepository
        .createQueryBuilder("pedido")
        .where("pedido.id_autorPedido = :id_autorPedido", {
          id_autorPedido: id,
        })
        .andWhere("pedido.estado = :estado", { estado: estadoEnum })
        .getMany();

      return res.status(200).json(pedidos);
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }

  //busca todos os pedidos do usuario que ta logado
  async readPedido(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      if (!authorization) {
        throw new Error("Não autorizado");
      }

      const token = authorization.split(" ")[1];

      const { id_usuario } = jwt.verify(
        token,
        process.env.JWT_PASS ?? ""
      ) as jwt.JwtPayload;

      const pedidos = await pedidoRepository.find({
        where: { id_autorPedido: id_usuario },
      });

      return res.status(200).json(pedidos);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o pedido anônimo" });
    }
  }
}
