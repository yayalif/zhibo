var _res, _req
var url = require('url')
var querystring = require('querystring')

exports.init = function (req, res) {
  _req = req
  _res = res
}
exports.GET = function (key) {
  var paramStr = url.parse(_req.url).query
  var param = querystring.parse(paramStr)
  return param[key] ? param[key]: ''
}
exports.POST = function (key, callback) {
  var postData = ''
  _req.addListener('data', function (postDataChunk) {
    postData += postDataChunk
  })
  _req.addListener('end', function () {
    var param = querystring.parse(postData)
    var value = param[key] ? param[key] : ''
    console.log(param, key + ': ' + value)
    callback(value)
  }) 
}