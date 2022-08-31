const jwt = require('jsonwebtoken')

function authToken(req, res, next) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) {
        const error = new Error('Missing token')
        error.status = 403
        return next(error)
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            const error = new Error('Invalid token')
            error.status = 403
            return next(error)
        }

        req.user_id = user.user_id
        next()
    })
}

module.exports = authToken