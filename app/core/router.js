var Login = require(CON + 'login')



exports.router = function(req, res) {
  var pathname = decodeURI(lib.url.parse(req.url).pathname)
  lib.httpParam.init(req, res)
  global.sessionLib = lib.session.start(req, res)
  var model = pathname.substr(1),
  controller = lib.httpParam.GET('c'),
  Class = ''
  if (pathname == '/favicon.ico') {
    return
  } else if (pathname == '/') {
    console.log('进入直播间页面')
    req.setEncoding('utf8')
    res.render(VIEW + 'index.jade', { 'title':'直播间' })
    return
  }
  try {
    Class = require(CON + model)
    console.log('获取'+ model + '函数')
  } catch(err) {
    console.log('调用静态文件')
    lib.staticModule.getStaticFile(pathname, res, req, BASE_DIR)
    return
  }
  if (Class) {
    var login = new Login(res, req)
    console.log('获取到了login', login)
    var ret = login.checkSession(model)
    if (ret) {
      var object = new Class(res, req)
      object[controller].call()
    } else {
      res.render(VIEW + 'index.jade', {
        'title': '直播间'
      })
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/plain'})
    res.end('can not find source')
  }
}
