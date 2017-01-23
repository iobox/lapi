import Extension from './../extension'

export default class ModuleExtension extends Extension {
  getName() {
    return 'foundation.extension.module'
  }
  
  /**
   * This method is called for setting up module.
   * Therefore, it could be used to listen application's events.
   * At this stage, the module would already receive application's container.
   */
  setUp() {}

  /**
   * This method is called when outgoing response is sent,
   * and application is going to close connection.
   * It is useful for do some shutdown actions, such as closing database connection.
   */
  tearDown() {}
}