/**
 * 设置路径全局变量
 */
global.BASE_DIR = __dirname
global.APP = BASE_DIR + '/app/'
global.CON = APP + '/controller/'
global.CORE = APP + '/core/'
global.LIB = BASE_DIR + '/node_modules/'
global.CONF = BASE_DIR + '/conf/'
global.STATIC = BASE_DIR + '/static/'
global.STATICJS = BASE_DIR + '/static/js/'
global.VIEW = BASE_DIR + '/view/'
/**
 * modules 引入
 */
global.lib = {
  http: require('http'),
  fs: require('fs'),
  url: require('url'),
  querystring: require('querystring'),
  httpParam: require(STATICJS + 'http_Param.js'),
  staticModule: require(STATICJS + 'static_module.js'),
  router: require(CORE + 'router'),
  action: require(CORE + 'action'),
  jade: require('jade'),
  socket: require('socket.io'),
  path: require('path'),
  // parseCookie: require('connect').utils.parseCookie,
  parseCookie: require('cookie'),
  // session: require(LIB + 'node_session'),
  session: require(STATICJS + 'session'),
  util: require('util')
}
global.onlineList = []
global.app = lib.http.createServer(function(req, res) {
  res.render = function () {
    var template = arguments[0]
    var options = arguments[1]
    var str = lib.fs.readFileSync(template, 'utf8')
    var fn = lib.jade.compile(str, {filename: template, pretty: true})
    var page = fn(options)
    res.writeHead(200, {'Content-Type': 'text/html'})
    res.end(page)
  }
  lib.router.router(req, res)
}).listen(8000)
global.io = lib.socket.listen(app)

var time = 0
io.sockets.on('connection', function (socket) {
    var username = sessionLib.username
    console.log(username, '有个用户上线拉')
    if (!onlineList[username]) {
      onlineList[username] = socket
    }
    var refresh_online = function () {
      var onlineUser = []
      for (var i in onlineList) {
        onlineUser.push(i)
      }
      try {
        var message = lib.fs.readFileSync(BASE_DIR + '/live_data.txt', 'utf8')
        socket.emit('live_data', message)
      } catch(err) {

      }
      io.sockets.emit('online_list', onlineUser || '') //所有人广播
    }
    refresh_online()
    // 确保每次发送一个socket消息
    if (time > 0) {
      return
    }
    socket.on('public', function (data) {
      var insertMsg = `${data.client}: ${data.msg}<br/>`
      writeFile({
        'msg': insertMsg,
        'data': data
      }, function (data) {
        io.sockets.emit('msg', data)
      })
    })
    socket.on('disconnect', function () {
      delete onlineList[username]
      refresh_online()
    })
    time++
  })

  function writeFile(data, callback) {
    console.log('缓存在文件里了', data, data.client, 'data:', data.data)
    var message = lib.fs.readFileSync(BASE_DIR + '/live_data.txt', 'utf8')
    lib.fs.writeFile(BASE_DIR + '/live_data.txt', message + data.msg, function (err) {
      if (err) throw err
      callback(data.data)
    })
  }
console.log('启动了')