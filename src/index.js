import App from './foundation/app'
import SystemExtension from './foundation/extension/system'
import Controller from './foundation/controller'

let app = new App()
app.extend(new SystemExtension())
var options = {
  'server.port': 8080,
  'logger.driver': 'file',
  'logger.options': './logs.txt'
}
app.run(options)

class MyController extends Controller {
  getUserAction() {
    return {
      user: this.getRequest().get('user'),
      email: this.getRequest().get('email')
    }
  }
}

app.get('/hello/{user}', null, (request) => {
  return {
    message: `Hello ${request.get('user')}!`
  }
})
app.put('/hello', null, (request) => {
  return request.getBody().getParsedContent().all()
})
