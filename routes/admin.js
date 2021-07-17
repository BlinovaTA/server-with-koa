const db = require('../db/index')

const skillsFields = ['age', 'concerts', 'cities', 'years']

const isValid = (value) => {
  if (value === '' || isNaN(value)) {
    return false
  }

  return true
}

const get = async (ctx, next) => {
  const skills = db.get('skills').value()

  return await ctx.render('pages/admin', { title: 'Admin page', skills })
}

const skills = async (ctx, next) => {
  const skills = ctx.request.body

  for (const skill in skills) {
    const value = skills[skill]

    if (skillsFields.includes(skill) && isValid(value)) {
      db.get('skills').find({ id: skill }).assign({ number: value }).write()
    }
  }

  return ctx.redirect('/admin')
}

module.exports = {
  get,
  skills,
}
