import { PedidoAnonimoController } from './controllers/PedidoAnonimoController';
import { HorarioController } from './controllers/HorarioController';
import { CargoController } from './controllers/CargoController';
import { PedidoController } from './controllers/PedidoController';
import { UsuarioController } from "./controllers/UsuarioController";
import { adminController } from './controllers/adminController';
import { Router } from "express";
import { autenticaoToken, adminAutenticacao } from './middlewares/autenticacaoToken';


import { upload } from "./uploadMiddleware"; // Importar o middleware de upload de arquivos

const routes = Router();

// PEDIDO ANÔNIMO

// Cadastro de pedido anônimo
routes.post("/pedidoanonimo/create", new PedidoAnonimoController().createPedidoAnonimo);
// lista de todos os pedidos
routes.get("/pedidoanonimo/get", new PedidoAnonimoController().listPedidosAnonimos)
// routes.get("/pedidoanonimo/geteste", new PedidoAnonimoController().listPedidosAnonimosT)
// lista pelo código do pedido
routes.get("/pedidoanonimo/getPedidoByCodigo/:codigo", new PedidoAnonimoController().getPedidoByCodigo)
// update pedido pelo código
routes.put("/pedidoanonimo/update/:codigo", new PedidoAnonimoController().updatePedido)
// delete pedido pelo código
routes.delete("/pedidoanonimo/delete/:codigo", new PedidoAnonimoController().deletePedido)

// USUÁRIO

// Login Usuario
routes.post("/login", new UsuarioController().login);

// Cadastro de usuário
routes.post("/usuario", new UsuarioController().create);



//a partir daqui tds as rotas so sao acessadas apenas com a token
routes.use(autenticaoToken)

// USUÁRIO 

//Buscanco informações do usuário
routes.get("/profile", new UsuarioController().getProfile)

// Atualizar usuário
routes.put("/user/update", new UsuarioController().updateUser)

// Deletar usuário
routes.delete("/user/delete", new UsuarioController().deleteUser)


// PEDIDO COM USUÁRIO

// Cadastro de pedido
routes.post("/pedido/create", new PedidoController().createPedido)
// lista todos os pedidos do usuário
routes.get("/pedido/get", new PedidoController().getPedidosByUsuario)
// lista todos os pedidos do usuario por estado
routes.get("/pedido/estado/:estado", new PedidoController().getPedidosByEstado);
// atualiza o pedido por id
routes.put("/pedido/update/:id_pedido", new PedidoController().updatePedido) //*
// deleta o pedido por id
routes.delete("/pedido/delete/:id_pedido", new PedidoController().deletePedido)


//rotas que sao acessadas pelo root
routes.use(adminAutenticacao)

// routes.get("/adminPedidos/estado_pedido=:estado", new adminController().readPedidos)
//retornar os pedidos a partir do estado
routes.put("/adminPedidos/id_pedido=:id_pedido", new adminController().updatePedidos)
//atualiza o pedido apartir do id
routes.get("/adminPedidos", new adminController().user)

// CARGO

// criar cargo
routes.post("/cargo/create", new CargoController().createCargo);
// listar cargos
routes.get("/cargo/get", new CargoController().listCargos)
// listar cargo por id
routes.get("/cargo/get/:id_cargo", new CargoController().getCargoById)
// update cargo
routes.put("/cargo/update/:id_cargo", new CargoController().updateCargo)
// deletar cargo
routes.delete("/cargo/delete/:id_cargo", new CargoController().deleteCargo)

// HORÁRIO

// criar horário
routes.post("/horario/create", new HorarioController().createHorario)
// lista todos os horários 
routes.get("/horario/get", new HorarioController().listHorarios)
// lista horario por id
routes.get("/horario/getById/:id_horario", new HorarioController().getHorarioById)
// update horário por id
routes.put("/horario/update/:id_horario", new HorarioController().updateHorario)
//delete horário por id
routes.delete("/horario/delete/:id_horario", new HorarioController().deleteHorario)

export default routes;
