import {MigrationInterface, QueryRunner} from "typeorm";

export class Migration1583676460269 implements MigrationInterface {
    name = 'Migration1583676460269'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "resource" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_c8ed18ff47475e2c4a7bf59daa0" UNIQUE ("name"), CONSTRAINT "PK_e2894a5867e06ae2e8889f1173f" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "resource_permission_to_user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "createOwn" boolean NOT NULL DEFAULT true, "readOwn" boolean NOT NULL DEFAULT true, "updateOwn" boolean NOT NULL DEFAULT true, "deleteOwn" boolean NOT NULL DEFAULT true, "createAny" boolean NOT NULL DEFAULT false, "readAny" boolean NOT NULL DEFAULT false, "updateAny" boolean NOT NULL DEFAULT false, "deleteAny" boolean NOT NULL DEFAULT false, "resourceId" uuid NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_386fb88a7dec42f2272c7ae7ab1" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "resource_permission_to_role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "createOwn" boolean NOT NULL DEFAULT true, "readOwn" boolean NOT NULL DEFAULT true, "updateOwn" boolean NOT NULL DEFAULT true, "deleteOwn" boolean NOT NULL DEFAULT true, "createAny" boolean NOT NULL DEFAULT false, "readAny" boolean NOT NULL DEFAULT false, "updateAny" boolean NOT NULL DEFAULT false, "deleteAny" boolean NOT NULL DEFAULT false, "resourceId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_bcc95b00305172feb301c2b0116" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "role" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "name" character varying NOT NULL, CONSTRAINT "UQ_ae4578dcaed5adff96595e61660" UNIQUE ("name"), CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "passwordHash" character varying NOT NULL, "firstName" character varying, "lastName" character varying, CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "refresh_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "isActive" boolean NOT NULL DEFAULT true, "created" TIMESTAMP NOT NULL DEFAULT now(), "updated" TIMESTAMP NOT NULL DEFAULT now(), "version" integer NOT NULL, "value" character varying NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_b575dd3c21fb0831013c909e7fe" PRIMARY KEY ("id"))`, undefined);
        await queryRunner.query(`CREATE TABLE "user_roles_role" ("userId" uuid NOT NULL, "roleId" uuid NOT NULL, CONSTRAINT "PK_b47cd6c84ee205ac5a713718292" PRIMARY KEY ("userId", "roleId"))`, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_5f9286e6c25594c6b88c108db7" ON "user_roles_role" ("userId") `, undefined);
        await queryRunner.query(`CREATE INDEX "IDX_4be2f7adf862634f5f803d246b" ON "user_roles_role" ("roleId") `, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_user" ADD CONSTRAINT "FK_85385ab5dc03b89d7dd18b5b44d" FOREIGN KEY ("resourceId") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_user" ADD CONSTRAINT "FK_30efd402cefbfe345fe255c3380" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_role" ADD CONSTRAINT "FK_ccb3e46d6b76b818ffe0aed7621" FOREIGN KEY ("resourceId") REFERENCES "resource"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_role" ADD CONSTRAINT "FK_a14c9b19ebf919e1a2f08a78ea3" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" ADD CONSTRAINT "FK_8e913e288156c133999341156ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_5f9286e6c25594c6b88c108db77" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" ADD CONSTRAINT "FK_4be2f7adf862634f5f803d246b8" FOREIGN KEY ("roleId") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE NO ACTION`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_4be2f7adf862634f5f803d246b8"`, undefined);
        await queryRunner.query(`ALTER TABLE "user_roles_role" DROP CONSTRAINT "FK_5f9286e6c25594c6b88c108db77"`, undefined);
        await queryRunner.query(`ALTER TABLE "refresh_token" DROP CONSTRAINT "FK_8e913e288156c133999341156ad"`, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_role" DROP CONSTRAINT "FK_a14c9b19ebf919e1a2f08a78ea3"`, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_role" DROP CONSTRAINT "FK_ccb3e46d6b76b818ffe0aed7621"`, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_user" DROP CONSTRAINT "FK_30efd402cefbfe345fe255c3380"`, undefined);
        await queryRunner.query(`ALTER TABLE "resource_permission_to_user" DROP CONSTRAINT "FK_85385ab5dc03b89d7dd18b5b44d"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_4be2f7adf862634f5f803d246b"`, undefined);
        await queryRunner.query(`DROP INDEX "IDX_5f9286e6c25594c6b88c108db7"`, undefined);
        await queryRunner.query(`DROP TABLE "user_roles_role"`, undefined);
        await queryRunner.query(`DROP TABLE "refresh_token"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "role"`, undefined);
        await queryRunner.query(`DROP TABLE "resource_permission_to_role"`, undefined);
        await queryRunner.query(`DROP TABLE "resource_permission_to_user"`, undefined);
        await queryRunner.query(`DROP TABLE "resource"`, undefined);
    }

}
