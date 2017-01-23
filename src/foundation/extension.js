import ContainerAware from '../di/container-aware'
import NotImplementedException from '../exception/not-implemented'
export default class Extension extends ContainerAware {
  getName() {
    throw new NotImplementedException()
  }
}