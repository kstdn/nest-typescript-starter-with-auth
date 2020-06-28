import { getRepository, MigrationInterface, QueryRunner } from "typeorm";
import { ResourcesSeed } from "./data/resources.seed";
import { RolesSeed } from "./data/roles.seed";
import { UsersSeed } from "./data/users.seed";

export class Seed1583676460270 implements MigrationInterface {

    public async up(_: QueryRunner): Promise<any> {
        const resourceRepo = getRepository("resource");
        const roleRepo = getRepository("role");
        const userRepo = getRepository("user");
        const resourcePermissionRepo = getRepository("resource_permission");
      
        // Create resource, role and user
        await Promise.all([
            resourceRepo.save(ResourcesSeed),
            roleRepo.save(RolesSeed),
            userRepo.save(UsersSeed),
        ]);

        // Get the created entities
        const [resources, roles, users] = await Promise.all([
            resourceRepo.find(),
            roleRepo.find(),
            userRepo.find(),
        ]);

        const userResource = resources.find(resource => resource['name'] === 'User');
        const permissionResource = resources.find(resource => resource['name'] === 'Permission');
        const roleResource = resources.find(resource => resource['name'] === 'Role');
        const resourceResource = resources.find(resource => resource['name'] === 'Resource');
        const adminRole = roles.find(role => role['name'] === "admin");
        const adminUser = users.find(user => user['username'] === "admin");
        
        // Create the resource permissions and assign them to the admin role

        // We set this manually because the correct subtype of ResourcePermission cannot
        // be inferred without importing the actual entity classes
        resourcePermissionRepo.metadata.discriminatorValue = 'ResourcePermissionToRole';
        
        await resourcePermissionRepo.insert([{
            resource: userResource,
            role: adminRole,
            createOwn: false,
            readOwn: true,
            updateOwn: false,
            deleteOwn: false,
            readAny: true,
            createAny: true,
            updateAny: true,
            deleteAny: true,
        }, {
            resource: permissionResource,
            role: adminRole,
            createOwn: false,
            readOwn: false,
            updateOwn: false,
            deleteOwn: false,
            readAny: true,
            createAny: true,
            updateAny: true,
            deleteAny: true,
        }, {
            resource: roleResource,
            role: adminRole,
            createOwn: false,
            readOwn: false,
            updateOwn: false,
            deleteOwn: false,
            readAny: true,
            createAny: true,
            updateAny: true,
            deleteAny: true,
        }, {
            resource: resourceResource,
            role: adminRole,
            readAny: true,
            createOwn: false,
            readOwn: false,
            updateOwn: false,
            deleteOwn: false,
        }]);

        // Assign the admin role to the admin user
        (await adminUser['roles']).push(adminRole);
        adminUser['save']();
    }

    public async down(_: QueryRunner): Promise<any> {
    }

}
