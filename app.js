const express = require('express')
const path = require('path')
const logger = require('morgan')
const PORT = process.env.PORT || 5501

const app = express()

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/exercises', require('./routes/exercises'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// error handler
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.json({
    message: err.message
  })
})

module.exports = app
