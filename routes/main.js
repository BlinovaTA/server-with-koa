const { products, skills } = require('../data.json')
const config = require('../config.json')
const nodemailer = require('nodemailer')

const get = async (ctx, next) => {
  return await ctx.render('pages/index', {
    title: 'Main page',
    products,
    skills,
  })
}

const post = async (ctx, next) => {
  const { name, email, message } = ctx.request.body

  if (!name || !email || !message) {
    return await ctx.render('pages/index', {
      title: 'Main page',
      products,
      skills,
      msgemail: 'All fields must be filled',
    })
  }

  try {
    const transporter = nodemailer.createTransport(config.mail.smtp)
    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text: message.trim().slice(0, 500) + `\n Sent from: <${email}>`,
    }

    await transporter.sendMail(mailOptions)

    return await ctx.render('pages/index', {
      title: 'Main page',
      products,
      skills,
      msgemail: 'Email sent successfully',
    })
  } catch (error) {
    return await ctx.render('pages/index', {
      title: 'Main page',
      products,
      skills,
      msgemail: `An error occurred while sending your email: ${error}`,
    })
  }
}

module.exports = {
  get,
  post,
}
