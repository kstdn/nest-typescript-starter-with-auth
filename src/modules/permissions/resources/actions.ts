import { Resource } from "./resource";
import { BasePermissionEntity } from "../entities/base-permission.entity";

export type ResourceActionPair = [Resource, keyof BasePermissionEntity];

export const CreateOwn = (resource: Resource): ResourceActionPair => [resource, 'createOwn'];
export const ReadOwn = (resource: Resource): ResourceActionPair => [resource, 'readOwn'];
export const UpdateOwn = (resource: Resource): ResourceActionPair => [resource, 'updateOwn'];
export const DeleteOwn = (resource: Resource): ResourceActionPair => [resource, 'deleteOwn'];
export const CreateAny = (resource: Resource): ResourceActionPair => [resource, 'createAny'];
export const ReadAny = (resource: Resource): ResourceActionPair => [resource, 'readAny'];
export const UpdateAny = (resource: Resource): ResourceActionPair => [resource, 'updateAny'];
export const DeleteAny = (resource: Resource): ResourceActionPair => [resource, 'deleteAny'];
