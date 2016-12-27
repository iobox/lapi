import ExtensionInterface from '../../../foundation/extension/interface'

/**
 * @interface
 */
export default class QueryExtensionInterface extends ExtensionInterface {
  /**
   * Return a list of supporting rule's names
   * @returns {Array}
   */
  register() {
    throw new Error('[Http/Query/Extension/Interface#register] register must be implemented')
  }
}