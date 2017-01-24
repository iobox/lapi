import App from './foundation/app'
import KernelExtension from './foundation/extension/kernel'
import Controller from './http/controller'
import NotFoundException from './http/exception/not-found'

let app = new App()
app.extend(new KernelExtension())
var options = {
  'server.port': 8080,
  'logger.driver': 'console',
  'logger.options': true
}
app.run(options)

class MyController extends Controller {
  getUserAction() {
    // throw new NotFoundException('This page could not be found!')
    return {
      user: this.getRequest().get('user'),
      email: this.getRequest().get('email')
    }
  }
}

// app.getContainer().get('events').once('http.response.send.before', (event, done) => {
//   event.response.getBody().setContent(JSON.stringify({
//     status: true,
//     message: 'Hello World!'
//   }))
//   done()
// })

app.get('/controller/action', null, {
  controller: new MyController(),
  action: 'getUserAction'
})
app.get('/hello/{user}', null, function() {
  const request = this.getRequest()
  return {
    message: `Hello^ ${request.get('user')}!`,
    queries: request.getQuery().all()
  }
})
app.put('/hello', null, function() {
  const request = this.getRequest()
  return request.getBody().getParsedContent().all()
})
