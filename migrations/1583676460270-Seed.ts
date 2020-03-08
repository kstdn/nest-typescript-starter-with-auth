import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { AdminPermissionsSeed } from "./data/permissions.seed";
import { RolesSeed } from "./data/roles.seed";
import { UsersSeed } from "./data/users.seed";

export class Seed1583676460270 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<any> {
        const adminPermissions = await getRepository("permission").save(AdminPermissionsSeed);
        const roles = await getRepository("role").save(RolesSeed);
        const users = await getRepository("user").save(UsersSeed);

        roles.find(role => role.name === 'admin').permissions.push(...adminPermissions);
        await getRepository("role").save(roles);

        users.find(user => user.username = "admin").roles.push(...roles);
        await getRepository("user").save(users);
    }

    public async down(_: QueryRunner): Promise<any> {
    }

}
