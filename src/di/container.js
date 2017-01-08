import Bag from '../foundation/bag'
import ContainerAware from './container-aware'
export default class Container extends Bag {
  set(key, value) {
    if (value instanceof ContainerAware) {
      value.setContainer(this)
    }
    super.set(key, value)
  }
}