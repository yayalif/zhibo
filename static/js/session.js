
var start = function (req, res) {
  // var conn = { res: res, req: req }
  var cookies = {}

  if (typeof req.headers.cookie !== 'undefined') {
    req.headers.cookie.split(';').forEach(function(cookie) {
      var parts = cookie.split('=')
      cookies[parts[0].trim()] = (parts[1] || '').trim()
    });
  } else {
    cookies.SESSID = 0
  }

  var SESSID = cookies.SESSID
  console.log(req.session, '读取sessionsession')
  if (req.session && req.session.SESSID) {
      session = req.session
      if (session.expires < Date()) {
        delete session[SESSID]
        return newSession(req, res)
      } else {
        var dt = new Date()
        dt.setMinutes(dt.getMinutes() + 30)

        session.expires = dt
        return session
      }
  } else {
    return newSession(req, res)
  }
  // if (typeof sessions[SESSID] !== 'undefined') {
  //   session = sessions[SESSID]
  //   if (session.expires < Date()) {
  //     delete sessions[SESSID]
  //     return newSession(conn.res)
  //   } else {
  //     var dt = new Date()
  //     dt.setMinutes(dt.getMinutes() + 30)

  //     session.expires = dt
  //     return sessions[SESSID]
  //   }
  // } else {
  //   return newSession(conn.res)
  // }
}

function newSession(req, res) {
  var chars='012345678ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghigklmnopqrstuvwxyz'
  var SESSID = ''
  
  for(var i = 0; i < 40; i++) {
    var rnum = Math.floor(Math.random() * chars.length)
    SESSID += chars.substring(rnum, rnum+i)
  }

  if (req.session && typeof req.session[SESSID] !== 'undefined') {
    return newSession(req, res)
  }

  var dt = new Date()
  dt.setMinutes(dt.getMinutes() + 30)

  var session = {
    SESSID: SESSID,
    expires: dt
  }
  // sessions[SESSID] = session
  req.session = session
  res.setHeader('Set-Cookie', 'SESSID=' + SESSID)
  return session
}
function cleanSessions() {
  for (sess in sessions) {
    if (sess.expires < Date()) {
      delete sessions[sess.SESSID]
    }
  }
}

exports.start = start