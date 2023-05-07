import { PedidoAnonimoController } from './controllers/PedidoAnonimoController';
import { HorarioController } from './controllers/HorarioController';
import { CargoController } from './controllers/CargoController';
import { PedidoController } from './controllers/PedidoController';
import { UsuarioController } from "./controllers/UsuarioController";
import { Router } from "express";
import { autenticaoToken } from './middlewares/autenticacaoToken';
import { adminController } from './controllers/adminController';

const routes = Router();

// Login Usuario
routes.post("/login", new UsuarioController().login);

routes.post("/usuario", new UsuarioController().create);
// Cadastro de usuário


routes.use(autenticaoToken)
//a partir daqui tds as rotas so sao acessadas apenas com a token

routes.get("/adminPedidos/estado=:estado", new adminController().readPedidos)
//retornar os pedidos a partir do estado
routes.put("/adminPedidos/id_pedido=:id_pedido", new adminController().updatePedidos)
//atualiza o pedido apartir do id


//Buscanco informações do usuário
routes.get("/profile", new UsuarioController().getProfile)

// Cadastro de cargo
routes.post("/cargo", new CargoController().createCargo);

// Cadastro de horário
routes.post("/horario", new HorarioController().createHorario);

// Cadastro de pedido anônimo
routes.post(
  "/pedidoanonimo",
  new PedidoAnonimoController().createPedidoAnonimo
);

// Cadastro de pedido com login
routes.post(
  "/pedido/:id_autorPedido/create",
  new PedidoController().createPedido
);

export default routes;
