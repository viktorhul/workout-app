const express = require('express')
const path = require('path')
const logger = require('morgan')
const dotenv = require('dotenv')
const PORT = process.env.PORT || 5501

dotenv.config()

const app = express()

app.listen(PORT, () => console.log(`Listening on port ${PORT}`))

const authToken = require('./utils/auth')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routes/index'))
app.use('/user', require('./routes/user'))
app.use('/exercises', authToken, require('./routes/exercises'))
app.use('/workouts', authToken, require('./routes/workouts'))

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})

// error handler
app.use((err, req, res, next) => {
  res.status(err.status || 500)

  console.log('ERROR:', res.statusCode, err.message)

  res.json({
    message: (res.statusCode != 500) ? err.message : 'Server error'
  })
})

module.exports = app
