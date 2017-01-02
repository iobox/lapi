import Bag from '../../foundation/bag'

/**
 * @implements {ModelInterface}
 */
export default class MongoModel extends Bag {
  getId() {
    return this.get(MongoModel.ID)
  }
}
MongoModel.ID = '_id'