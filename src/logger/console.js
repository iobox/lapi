import LoggerInterface from './interface'
var color = require('cli-color')

export default class ConsoleLogger extends LoggerInterface {
  constructor(trace = false) {
    super()
    this._trace = trace
  }

  /**
   * Allow to trace or not
   * @returns {boolean}
   */
  isTraceable() {
    return this._trace
  }

  write(type = LoggerInterface.TYPE_INFO, message = '', traces = []) {
    const now = new Date()
    message = `[${now.toJSON()}] [${type}] ${message}`
    switch (type) {
      case LoggerInterface.TYPE_ERROR:
        console.log(color.red(message))
        break
      case LoggerInterface.TYPE_WARNING:
        console.log(color.yellow(message))
        break
      case LoggerInterface.TYPE_DEBUG:
      case LoggerInterface.TYPE_INFO:
      default:
        console.log(color.blue(message))
        break
    }
    if (this.isTraceable()) {
      const gray = color.xterm(219)
      traces.forEach((line) => {
        console.log(gray(`[${now.toJSON()}] [trace]`), line)
      })
    }
    console.log('')
  }
}