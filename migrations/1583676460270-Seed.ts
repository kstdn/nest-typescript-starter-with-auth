import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { ResourcesSeed } from "./data/resources.seed";
import { RolesSeed } from "./data/roles.seed";
import { UsersSeed } from "./data/users.seed";      

export class Seed1583676460270 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<any> {
        // Create resource, role and user
        await getRepository("resource").save(ResourcesSeed);
        await getRepository("role").save(RolesSeed);
        await getRepository("user").save(UsersSeed);
        
        // Get the created entities
        const profileResource = (await getRepository("resource").find()).find(resource => resource['name'] === 'Profile');
        const adminRole = (await getRepository("role").find()).find(role => role['name'] === "admin");
        const adminUser = (await getRepository("user").find()).find(user => user['username'] === "admin");
        
        // Create the resource permission and assign it to the admin role
        await getRepository("resource_permission").save({
            resource: profileResource,
            role: adminRole,
            readAny: true
        });

        // Assign the admin role to the admin user
        (await adminUser['roles']).push(adminRole);
        adminUser['save']();
    }

    public async down(_: QueryRunner): Promise<any> {
    }

}
