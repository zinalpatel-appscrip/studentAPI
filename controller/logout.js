const jwt = require('jsonwebtoken')
const Boom = require('@hapi/boom')
const mongodb = require('mongodb')
const db = require('../db/conn')

module.exports = {
    logout : async (req, res) => {

        try {
            const token = req.headers.token
            if (token) {
                const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)
                if (decodedToken) {
                    const result = await db.get().collection('auth').deleteOne(
                        {
                            user: mongodb.ObjectId(decodedToken.payload.user),
                            access_token: decodedToken.payload.access_token
                        }
                    )

                    if (result.deletedCount === 1) {
                        return res.response({message: 'Logged Out!!'}).code(200)
                    }
                    else {
                        return res.response({ message: 'Something Went Wrong!!'}).code(409)
                    }
                }
                else
                    return Boom.unauthorized('Unauthorized')
            }
            else {
                return Boom.unauthorized('Unauthorized')
            }
        } catch (e) {
            console.log(e)
        }

    }
}
