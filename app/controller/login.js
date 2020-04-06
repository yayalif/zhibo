module.exports = function () {
  var _res = arguments[0]
  var _req = arguments[1]
  
  this.checkSession = function(model) {
    if (model == 'login') {
      return true
    } else if (sessionLib.username && sessionLib.username !== '') {
      return true
    }
    return false
  }
  this.login = function () {
    lib.httpParam.POST('username', function (value) {
      console.log('登录', value)
      sessionLib.username = value
      if (value == 'yaya') {
        // _res.render(VIEW + 'live.html', {
        //   'user': value
        // })
        let filePath = VIEW + 'live.html'
        let filePage = lib.fs.readFileSync(filePath, 'utf8')
        _res.writeHead(200, {
          'Content-Type': 'text/html'
        })
        _res.end(filePage)
      } else {
        _res.render(VIEW + 'main.jade', {
          'user': value
        })
      }
      
    })
    
  }
}