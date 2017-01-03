import RepositoryInterface from './interface'
import MongoModel from '../model/mongo'

export default class MongoRepository extends RepositoryInterface {
  findId(id) {
    const key = MongoModel.ID
    return this.find({key: id})
  }

  find(condition) {
    return new Promise((resolve, reject) => {
      
    })
  }
}