import Repository from './repository'
import MongoModel from '../model/mongo'

export default class MongoRepository extends Repository {
  findId(id) {
    const condition = {}
    condition[MongoModel.ID] = id
    return this.find(condition)
  }

  find(condition) {
    return new Promise((resolve, reject) => {
      
    })
  }
}