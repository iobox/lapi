import Model from './model'
export default class MongoModel extends Model {
  getId() {
    return this.get(MongoModel.ID)
  }
}
MongoModel.ID = '_id'