const db = require('../db/index')

const get = async (ctx, next) => {
  return await ctx.render('pages/login', { title: 'SignIn page'})
}

const post = async (ctx, next) => {
  const {email, password } = ctx.request.body;

  if (!email || !password) {
    return await ctx.render('pages/login', {
      title: 'SigIn page',
      msglogin: 'Incorrect email or password',
    })
  }

  const userIsExist = db.get('users').find({ email, password }).value();

  if (userIsExist) {
    return await ctx.redirect('/admin')
  } else {
    return await ctx.render('pages/login', {
      title: 'SigIn page',
      msglogin: 'User not founded',
    })
  }
}

module.exports = {
  get,
  post
}
