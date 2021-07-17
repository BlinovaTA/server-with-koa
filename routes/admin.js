const { skills } = require('../data.json')

const get = async (ctx, next) => {
  return await ctx.render('pages/admin', { title: 'Admin page', ...skills })
}

module.exports = {
  get
}
