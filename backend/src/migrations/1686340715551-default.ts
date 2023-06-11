import { MigrationInterface, QueryRunner } from "typeorm";

export class default1686340715551 implements MigrationInterface {
    name = 'default1686340715551'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_208826353b1be16c00ea5a9099a"`);
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" DROP CONSTRAINT "FK_feaa58d9634e2758729f20154b6"`);
        await queryRunner.query(`CREATE TABLE "horaDisponivel" ("id_hora" SERIAL NOT NULL, "dataInicio" text NOT NULL, "dataFim" text NOT NULL, "disponivel" boolean NOT NULL, CONSTRAINT "PK_e2b2153f36b07980e4706ab775f" PRIMARY KEY ("id_hora"))`);
        await queryRunner.query(`ALTER TABLE "usuarios" DROP CONSTRAINT "UQ_09123a64c09426e71457354d875"`);
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" DROP COLUMN "arquivo"`);
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" ADD "arquivo" text`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_208826353b1be16c00ea5a9099a" FOREIGN KEY ("id_horaDisponivel") REFERENCES "horaDisponivel"("id_hora") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" ADD CONSTRAINT "FK_feaa58d9634e2758729f20154b6" FOREIGN KEY ("id_horaDisponivel") REFERENCES "horaDisponivel"("id_hora") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" DROP CONSTRAINT "FK_feaa58d9634e2758729f20154b6"`);
        await queryRunner.query(`ALTER TABLE "pedidos" DROP CONSTRAINT "FK_208826353b1be16c00ea5a9099a"`);
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" DROP COLUMN "arquivo"`);
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" ADD "arquivo" bytea`);
        await queryRunner.query(`ALTER TABLE "usuarios" ADD CONSTRAINT "UQ_09123a64c09426e71457354d875" UNIQUE ("senha")`);
        await queryRunner.query(`DROP TABLE "horaDisponivel"`);
        await queryRunner.query(`ALTER TABLE "pedidosAnonimo" ADD CONSTRAINT "FK_feaa58d9634e2758729f20154b6" FOREIGN KEY ("id_horaDisponivel") REFERENCES "HoraDisponivel"("id_hora") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "pedidos" ADD CONSTRAINT "FK_208826353b1be16c00ea5a9099a" FOREIGN KEY ("id_horaDisponivel") REFERENCES "HoraDisponivel"("id_hora") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
