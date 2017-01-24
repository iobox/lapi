import NotImplementedException from '../exception/not-implemented'
/**
 * @interface
 */
export default class LoggerInterface {
  /**
   * Write a message
   * @param {string} [type='info']
   * @param {string} [message='']
   * @param {Array} [traces=[]]
   */
  write(type = LoggerInterface.TYPE_INFO, message = '', traces = []) {
    throw new NotImplementedException('[logger.LoggerInterface#write]')
  }
}
LoggerInterface.TYPE_ERROR   = 'error'
LoggerInterface.TYPE_INFO    = 'info'
LoggerInterface.TYPE_WARNING = 'warning'
LoggerInterface.TYPE_DEBUG   = 'debug'