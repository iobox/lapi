import LoggerInterface from './interface'
export default class EmptyLogger extends LoggerInterface {
  write(type = LoggerInterface.TYPE_INFO, message = '', traces = []) {}
}