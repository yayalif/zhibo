var fs = require('fs')
exports.getStaticFile = function (pathname, res, req, BASE_DIR) {
  var filePath = BASE_DIR + '/static/' + pathname
  var filePage = fs.readFileSync(filePath)
  res.end(filePage)
}