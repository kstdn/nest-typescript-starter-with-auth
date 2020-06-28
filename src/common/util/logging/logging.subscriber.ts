import {
  EntitySubscriberInterface,
  EventSubscriber,
  UpdateEvent,
  RemoveEvent,
} from 'typeorm';
import { Log } from './log.entity';
import { BaseDBEntity } from 'src/common/entities/base.entity';

@EventSubscriber()
export class LoggingSubscriber implements EntitySubscriberInterface {

  beforeUpdate(event: UpdateEvent<BaseDBEntity>): void {
    const log = new Log();
    log.operation = 'Update';
    log.entityId = event.entity.id;
    log.stateBeforeOperation = JSON.stringify(event.databaseEntity);
    log.stateAfterOperation = JSON.stringify(event.entity);
    log.save();
  }

  beforeRemove(event: RemoveEvent<BaseDBEntity>): void {
    const log = new Log();
    if(event.databaseEntity) {
      log.entityId = event.databaseEntity.id;
      log.operation = 'Delete';
      log.stateBeforeOperation = JSON.stringify(event.databaseEntity);
      log.save();
    }
  }
}
