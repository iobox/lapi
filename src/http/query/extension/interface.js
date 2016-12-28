import FoundationExtensionInterface from '../../../foundation/extension/interface'

/**
 * @interface
 * @extends {src/foundation/extension/interface.js~ExtensionInterface}
 */
export default class ExtensionInterface extends FoundationExtensionInterface {
  /**
   * Return a list of supporting rule's names
   * @returns {Array}
   */
  register() {
    throw new Error('[Http/Query/Extension/Interface#register] register must be implemented')
  }
}