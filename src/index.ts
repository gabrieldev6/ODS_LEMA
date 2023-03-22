import express from "express";
import { resolve } from "path";
import { AppDataSource } from "./data-source";
import routes from "./routes";

AppDataSource.initialize().then(() => {
  const app = express();

  app.use(express.json());

  app.use(routes);

  console.log(process.env.PORT)
  return app.listen(process.env.PORT);
});
