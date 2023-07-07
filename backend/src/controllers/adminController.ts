import { Request, Response } from "express";
import { pedidoRepository } from "../repositories/PedidoRepository";
import { Pedido } from "../entities/Pedido.entities";
import { Estado } from "../models/Pedido";
import * as jwt from "jsonwebtoken"
import { usuarioRepository } from "../repositories/UsuarioRepository";
//import { Usuario } from "../models/Usuario";
import { Usuario } from "../entities/Usuario.entities";
import { BadRequestError } from "../helpers/api-erros";
import { error } from "console";
import * as bcrypt from "bcrypt";
export class adminController {

    async readPedidos (req: Request, res: Response) {
        
        const {estado} = req.params
        console.log(estado)
        

        //se estiver estado ele retorna todos aqueles com estado que tiver
        if(estado != null) {

            //transforma string em enum
            const estadoEnum: Estado = Estado[estado as keyof typeof Estado];
            const pedidos = await pedidoRepository.find({where: {estado: estadoEnum}})
            return res.status(200).json(pedidos)

        } else if (estado == typeof Number) {
            
        } else {

            //caso nao tenha passado nada, ele vai retornar td a tabela de pedido
            const pedidos = await pedidoRepository.find()
            return res.status(200).json(pedidos)
        }
        
        
        
    }
    async deletePedidos(req: Request, res: Response) {
        const { authorization } = req.headers;
        const {id_pedido} = req.params
        
        if(!authorization) {
            throw new BadRequestError("nao autorizado")
        }
        const token = authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
            id: number;
        };

        const pedido = await pedidoRepository.delete({id_autorPedido: Number(id_pedido)})

        if(pedido.affected == 1) {
            return res.status(200).json("pedido deletado")
        } else {
            return res.status(202).json("algo aconteceu, nao foi possivel deletar pedido  cccccccxxc")
        }
        
    }
    async updatePedidos (req: Request, res: Response) {
        const { authorization } = req.headers;
        const {id_pedido} = req.params
        //vai pegar o id
        const {estado} = req.body

        if(!authorization) {
            throw new BadRequestError("nao autorizado")
        }
        const token = authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
            id: number;
        };

        
        //pega o estado que quer trocar
        let pedidoRetornado = await pedidoRepository.findOneBy({id_pedido: Number(id_pedido)})
       //pega a linha que vai ser alterada

        const pedido = await pedidoRepository.createQueryBuilder()
        .update(Pedido).set({estado: estado, id_autorAutorizador: decodedToken.id})
        .where({ id_pedido: id_pedido })
        .execute()

        //faz alteracao do estado
        pedidoRetornado = await pedidoRepository.findOneBy({id_pedido: Number(id_pedido)})
        //pedido ja alterado

        if(pedidoRetornado!=null)
        {
            pedido.generatedMaps = [Object(estado)]
            pedido.raw = pedidoRetornado
        } else {
            return res.status(404).json('pedido não encontrado')
        }

        //incluo no retorno a linha como era antes da alteracao

        return res.status(201).json(pedido)
    }
    
    async listUser (req: Request, res: Response) {
        const {id_usuario} = req.params
        console.log(id_usuario)

        if(id_usuario == null) {
            const user = await usuarioRepository.find()
            return res.status(200).json(user)

        } else {
            const user = await usuarioRepository.findOneBy({id_usuario: Number(id_usuario)})
            return res.status(200).json(user)
        }
    }


    async deleteUser (req: Request, res: Response) {
        const {id_usuario} = req.params
        console.log(id_usuario)

        const pedido = await pedidoRepository.delete({id_autorPedido: Number(id_usuario)})
        const useReturn = await usuarioRepository.delete({id_usuario: Number(id_usuario)})
        

        if(useReturn.affected == 1 || pedido.affected == 1) {
            return res.status(200).json("usuario deletado com sucesso")
        } else {
            return res.status(404).json("não foi possivel deletar, certifique se tudo está correto e tente novamente")
        }
        
    }

    async updateUser (req: Request, res: Response) {
        const {id_usuario} = req.params
        const {nome, email, senha, cargo} = req.body

        const user = await usuarioRepository.findOneBy({id_usuario: Number(id_usuario)})
        if(!user) {
            throw new BadRequestError("usuario nao existe")
        }

        user.nome = nome || user.nome;
        user.email = email || user.email;
        user.senha = senha || user.senha;
        user.id_cargo = cargo || user.id_cargo;

        const salt = bcrypt.genSaltSync(12);
        const senhaCript = bcrypt.hashSync(senha, salt);
        console.log(user, Usuario)

        const useReturn = await usuarioRepository.createQueryBuilder()
        .update(new Usuario())
        .set({nome: nome, email: email, senha: senhaCript, id_cargo: cargo})
        .where({ id_usuario: id_usuario })
        .execute()
        
        if(useReturn.affected == 1) {
            return res.status(200).json("alteração feita com sucesso")
        } else {
            return res.status(404).json("não foi possivel alterar usuário, certifique se tudo está correto e tente novamente")
        }
    }
    

}