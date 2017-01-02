import LoggerInterface from './interface'
const fs = require('fs')

export default class FileLogger extends LoggerInterface {
  constructor(path = null) {
    super()
    this.setPath(path)
  }

  /**
   * Get path
   * @returns {string}
   */
  getPath() {
    return this._path
  }

  /**
   * Set path
   * @param {string} path
   */
  setPath(path) {
    this._path = path
  }

  write(type = LoggerInterface.TYPE_INFO, message = '', traces = []) {
    let options = {encoding: 'utf8', flag: 'a'}
    const now = new Date()
    message = `[${now.toJSON()}] [${type}] ${message}\n`
    fs.writeFileSync(this.getPath(), message, options)
    traces.forEach((line) => {
      fs.writeFileSync(this.getPath(), `[${now.toJSON()}] ${line}\n`, options)
    })
  }
}