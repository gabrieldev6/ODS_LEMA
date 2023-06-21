import { usuarioRepository } from "./../repositories/UsuarioRepository";
import { cargoRepository } from "./../repositories/CargoRepository";
import { Response, Request } from "express";
import { Usuario } from "../models/Usuario";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { BadRequestError, UnauthorizedError } from "../helpers/api-erros";


type JwtPayload = {
  id_usuario: number;
};

export class UsuarioController {
  async create(req: Request, res: Response) {
    try {
      // criar usuário
      const { nome, email, senha, cargo } = req.body;

      const userExists = await usuarioRepository.findOneBy({ email });

      if (userExists) {
        throw new BadRequestError("Email já cadastrado ");
      }

      // Obtenha o objeto do cargo com base no nome fornecido
      const cargoObj = await cargoRepository.findOneBy({ cargo });

      if (!cargoObj) {
        throw new BadRequestError("Cargo inválido");
      }

      let user = Usuario.create(nome, email, senha, cargo);

      const newUsuario = usuarioRepository.create({
        nome: user.nome,
        email: user.email,
        senha: user.senha,
        id_cargo: { id_cargo: cargoObj.id_cargo },
      });

      const { senha: _, ...userSemSenha } = newUsuario;

      await usuarioRepository.save(newUsuario);

      return res.status(201).json(userSemSenha);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o usuário" });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email, senha } = req.body;

      const user = await usuarioRepository.findOne({ where: {email: email }, relations: ['id_cargo']});

      //console.log(email, senha, user)
      if (!user) {
        throw new BadRequestError("E-mail ou senha inválidos ");
      }

      const verifyPass = await bcrypt.compare(senha, user.senha);

      if (!verifyPass) {
        throw new BadRequestError("E-mail ou senha inválidos ");
      }

      //criando token para autenticar usuario
      const token = jwt.sign(
        { id: user.id_usuario },
        process.env.JWT_PASS ?? "",
        {
          expiresIn: "8h",
        }
      );

      console.log("token", token);

      const { senha: _, ...userLogin } = user;

      return res.json({
        user: userLogin,
        token: token,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o usuário" });
    }
  }

  //usuario vai conseguir obter seus dados apartir do token
  async getProfile(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new BadRequestError("Não autorizado");
      }

      // verificando se o token existe
      const token = authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
        id: number;
      };
      const { id } = decodedToken;

      const user = await usuarioRepository.findOne({
        where: { id_usuario: id },
        relations: ["id_cargo"],
      });

      if (user == null) {
        throw new UnauthorizedError("Não autorizado");
      }

      const { senha: _, ...loggedUser } = user;

      return res.json(loggedUser);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o usuário" });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;
      const { nome, email, senha } = req.body;

      if (!authorization) {
        throw new BadRequestError("Não autorizado");
      }

      const token = authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
        id: number;
      };

      const { id } = decodedToken;

      const user = await usuarioRepository.findOne({
        where: { id_usuario: id },
      });

      if (!user) {
        throw new UnauthorizedError("Não autorizado");
      }

      // Atualizar as informações do usuário

      user.nome = nome || user.nome;
      user.email = email || user.email;

      if (senha) {
        user.senha = await bcrypt.hash(senha, 10);
      }

      await usuarioRepository.save(user);

      const { senha: _, ...updatedUser } = user;
      return res.json(updatedUser);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o usuário" });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const { authorization } = req.headers;

      if (!authorization) {
        throw new BadRequestError("Não autorizado");
      }

      const token = authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, process.env.JWT_PASS ?? "") as {
        id: number;
      };

      const { id } = decodedToken;

      const user = await usuarioRepository.findOne({
        where: { id_usuario: id },
      });

      if (!user) {
        throw new BadRequestError("Não autorizado");
      }

      await usuarioRepository.delete(user.id_usuario);

      return res.json({ message: "Usuário excluído com sucesso" });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Ocorreu um erro ao criar o usuário" });
    }
  }
}
