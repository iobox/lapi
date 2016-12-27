/**
 * @interface
 */
export default class ExtensionInterface {
  /**
   * @returns {string}
   */
  getName() {
    throw new Error('[Foundation/Extension/Interface#getName] getName must be implemented')
  }
}