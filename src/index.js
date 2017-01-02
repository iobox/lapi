import App from './foundation/app'
import SystemExtension from './foundation/extension/system'
import Controller from './foundation/controller'
import NotFoundException from './http/exception/not-found'

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
    throw new NotFoundException('This page could not be found!')
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
    message: `Hello ${request.get('user')}!`
  }
})
app.put('/hello', null, function() {
  const request = this.getRequest()
  return request.getBody().getParsedContent().all()
})
