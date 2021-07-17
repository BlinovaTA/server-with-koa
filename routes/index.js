const Router = require('koa-router')
const router = new Router()
const main = require('./main')
koaBody = require('koa-body')

router.get('/', main.get).post('/', koaBody(), main.post)

/* router.use('/login', require('./login'))

router.use('/admin', require('./admin')) */

module.exports = router
