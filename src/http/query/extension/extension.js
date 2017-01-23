import Extension from '../../../foundation/extension'
export default class QueryExtension extends Extension {
  /**
   * Return a list of supporting rule's names
   * @returns {Array}
   */
  register() {
    throw new Error('[Http/Query/Extension/QueryExtension#register] register must be implemented')
  }
}