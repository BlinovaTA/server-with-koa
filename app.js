const Koa = require('koa')
const app = new Koa()
const fs = require('fs/promises')
const { constants } = require('fs')
const path = require('path')
const static = require('koa-static')
const session = require('koa-session')
const Pug = require('koa-pug')
const pug = new Pug({
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app,
})
const errorHandler = require('./libs/error')
const config = require('./config')
const router = require('./routes')
const port = process.env.PORT || 5000

app.use(static('./public'))

app.use(errorHandler)

app.on('error', (err, ctx) => {
  ctx.request
  ctx.response.body = {}
  ctx.render('error', {
    status: ctx.response.status,
    error: ctx.response.message,
  })
})

app
  .use(session(config.session, app))
  .use(router.routes())
  .use(router.allowedMethods())

app.listen(port, async () => {
  const upload = path.normalize(path.join('./public', 'upload'))

  await fs.access('./public', constants.R_OK | constants.W_OK)
  await fs.mkdir(upload, { recursive: true })

  console.log(`> Ready On Server http://localhost:${port}`)
})
