const db = require('../db/index')
const formidable = require('formidable')
const fs = require('fs/promises')
const path = require('path')

const skillsFields = ['age', 'concerts', 'cities', 'years']

const isValid = (value) => {
  if (value === '' || isNaN(value)) {
    return false
  }

  return true
}

const validation = (fields, files) => {
  if (files.photo.name === '' || files.photo.size === 0) {
    return { status: 'Picture not loaded', err: true }
  }

  if (!fields.name) {
    return { status: 'No picture description', err: true }
  }

  if (!fields.price) {
    return { status: 'No price', err: true }
  }

  return { status: 'Ok', err: false }
}

const get = async (ctx, next) => {
  const skills = await db.get('skills')

  return await ctx.render('pages/admin', { title: 'Admin page', skills })
}

const skills = async (ctx, next) => {
  const skills = ctx.request.body

  for (const skill in skills) {
    const value = skills[skill]

    if (skillsFields.includes(skill) && isValid(value)) {
      db.rewrite('skills', { id: skill }, { number: value })
    }
  }

  return ctx.redirect('/admin')
}

const upload = async (ctx, next) => {
  try {
    const form = new formidable.IncomingForm()
    const upload = path.normalize(path.join('./public', 'upload'))

    form.uploadDir = path.normalize(path.join(process.cwd(), upload))

    form.parse(ctx.req, async (err, fields, files) => {
      if (err) {
        return next(err)
      }

      const valid = validation(fields, files)

      const { path: photoPath, name: photoName } = files.photo
      const { price, name } = fields

      if (valid.err) {
        await fs.unlink(photoPath)

        return next({ message: valid.status })
      }

      const fileName = path.normalize(path.join(upload, photoName))

      await fs.rename(photoPath, fileName)

      db.push('products', {
        src: path.normalize(path.join('/upload', photoName)),
        name: name,
        price: Number(price),
      })
    })

    return ctx.redirect('/admin')
  } catch (error) {
    next(error)
  }
}

module.exports = {
  get,
  skills,
  upload,
}
