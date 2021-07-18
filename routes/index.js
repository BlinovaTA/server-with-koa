const Router = require('koa-router')
const router = new Router()
koaBody = require('koa-body')
const main = require('./main')
const login = require('./login')
const admin = require('./admin')

router
  .get('/', main.get)
  .post('/', koaBody(), main.post)
  .get('/login', login.get)
  .post('/login', koaBody(), login.post)
  .get('/admin', admin.get)
  .post('/admin/skills', koaBody(), admin.skills)
  .post('/admin/upload', koaBody(), admin.upload)

/* router.use('/login', require('./login'))

router.use('/admin', require('./admin')) */

module.exports = router
