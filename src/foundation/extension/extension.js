import ContainerAware from '../container/container-aware'
import NotImplementedException from '../../exception/not-implemented'
export default class Extension extends ContainerAware {
  getName() {
    throw new NotImplementedException()
  }
}