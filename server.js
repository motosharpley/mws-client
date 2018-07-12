const express = require('express')
const serveStatic = require('serve-static')


const app = express()

// const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS
// app.use(redirectToHTTPS())

app.use(serveStatic('dist'))

app.listen(3000, () => console.log('server is listening on port ...3000'))