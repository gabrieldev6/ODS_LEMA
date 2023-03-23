import { Usuario } from "./Usuario";

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";

@Entity("cargos")
export class Cargo {
  @PrimaryGeneratedColumn()
  id_cargo: number;

  @Column({ type: "text" })
  cargo: string = "Membro da Comunidade";

  @OneToMany(() => Usuario, (usuario) => usuario.id_cargo)
  id_usuario: Cargo[] | null;

  constructor(id_cargo:number, cargo:string, id_usuario: Cargo[] | null){
    this.id_cargo = id_cargo
    this.cargo = cargo
    this.id_usuario = id_usuario
  }
}
