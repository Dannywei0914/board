const http = require('http')
const fs = require('fs')
const url = require('url')
const template = require('art-template')
let comments = [
  {
    name: '陳柏偉',
    message: '今天天氣不錯',
    dateTime: '2019-08-09 13:00:00'
  },
  {
    name: '陳柏政',
    message: '還可以',
    dateTime: '2019-08-09 13:05:00'
  }
]
const server = http.createServer()
server.on('request', function(req, res) {
  let urlObj = url.parse(req.url, true)
  let pathname = urlObj.pathname

  function toErrorPage() {
    fs.readFile('./views/404.html', (err, data) => {
      if (err) {
        return res.end('404')
      }
      res.end(data)
    })
  }

  if (pathname.indexOf('/public/') === 0) {
    fs.readFile(`.${pathname}`, (err, data) => {
      if(err) return toErrorPage()
      res.end(data)
    })
  } else if (pathname === '/') {
    fs.readFile('./views/index.html', (err, data) => {
      if(err) {
        return toErrorPage()
      }
      let afterRenderData = template.render(data.toString(), {
        comments: comments
      })
      res.end(afterRenderData)
    })
  } else if (pathname === '/post') {
    fs.readFile('./views/post.html', (err, data) => {
      if (err) {
        return toErrorPage()
      }
      res.end(data)
    })
  } else if (pathname === '/comment') {
    let commentData = urlObj.query
    commentData.dateTime = new Date(). toLocaleString()
    comments.unshift(commentData)
    res.statusCode = 302
    res.setHeader('Location', '/')
    res.end()
  }
})
// http.createServer(function(req, res) {
  
// })

server.listen('9000', function() {
  console.log('伺服器正在運行')
})