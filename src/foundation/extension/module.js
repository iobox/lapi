import ContainerExtension from './container'

export default class ModuleExtension extends ContainerExtension {
  /**
   * This method is called for setting up module.
   * Therefore, it could be used to listen application's events.
   * At this stage, the module would already receive application's container.
   */
  setUp() {}

  /**
   * This method is called when application is encountered an error.
   * It could be useful for listening errors and logging them.
   */
  tearDown() {}
}