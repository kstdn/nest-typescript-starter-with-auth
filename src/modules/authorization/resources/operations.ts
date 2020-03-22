import { Resource } from './resource';
import { ResourceOperationPair } from './resource-operation-pair';

export const CreateOwn = (resource: Resource): ResourceOperationPair => [resource, 'createOwn'];
export const ReadOwn = (resource: Resource): ResourceOperationPair => [resource, 'readOwn'];
export const UpdateOwn = (resource: Resource): ResourceOperationPair => [resource, 'updateOwn'];
export const DeleteOwn = (resource: Resource): ResourceOperationPair => [resource, 'deleteOwn'];
export const CreateAny = (resource: Resource): ResourceOperationPair => [resource, 'createAny'];
export const ReadAny = (resource: Resource): ResourceOperationPair => [resource, 'readAny'];
export const UpdateAny = (resource: Resource): ResourceOperationPair => [resource, 'updateAny'];
export const DeleteAny = (resource: Resource): ResourceOperationPair => [resource, 'deleteAny'];
