import Kernel from './kernel'
import Extension from './extension'

export default class App extends Kernel {
  constructor(container) {
    super(container)
  }

  /**
   * Register one or multiple extensions
   * @param {Extension|Extension[]} extensions
   */
  register(extensions) {
    if (Array.isArray(extensions)) {
      for (const extension of extensions) {
        this._registerExtension(extension)
      }
    } else if (extensions instanceof Extension) {
      this._registerExtension(extensions)
    } else {
      throw new Error('[App#register] Input argument must be either an array of Extension or an instance of Extension')
    }
  }

  /**
   * Register an extension
   * @param {Extension} extension
   * @private
   */
  _registerExtension(extension) {
    
  }
}
