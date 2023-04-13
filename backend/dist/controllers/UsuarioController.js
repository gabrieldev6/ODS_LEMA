"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const UsuarioRepository_1 = require("./../repositories/UsuarioRepository");
const Usuario_1 = require("../models/Usuario");
const bcrypt = __importStar(require("bcrypt"));
class UsuarioController {
    async create(req, res) {
        // criar usuário
        const { nome, email, senha, id_cargo } = req.body;
        let user = Usuario_1.Usuario.create(nome, email, senha, id_cargo, null, null, null);
        const salt = bcrypt.genSaltSync(12);
        let senhaH = bcrypt.hashSync(senha, salt);
        user.senha = senhaH;
        const newUsuario = UsuarioRepository_1.usuarioRepository.create(user);
        await UsuarioRepository_1.usuarioRepository.save(newUsuario);
        return res.status(201).json(newUsuario);
    }
}
exports.UsuarioController = UsuarioController;
