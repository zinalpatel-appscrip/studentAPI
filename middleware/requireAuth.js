const jwt = require('jsonwebtoken')
require('dotenv').config()
const Boom = require('@hapi/boom')
const mongodb = require('mongodb')
const db = require('../db/conn')

const requireAuth = async (req, res) => {

    try {
        const token = req.headers.token
        if (token) {
            const decodedToken = await jwt.verify(token, process.env.SECRET_KEY)
            // console.log(decodedToken)
            if (decodedToken) {
                const data = await db.get().collection('auth').aggregate([
                    {
                        $match: {
                            user: mongodb.ObjectId(decodedToken.payload.user),
                            access_token: decodedToken.payload.access_token
                        }
                    }
                ]).toArray()

                // console.log(data)
                if (data.length) {
                    // console.log("in if")
                    return res.response('Token Validated').code(200)
                }
                else {
                    // console.log("in else")
                    return Boom.unauthorized('Unauthorized')
                }
            }
            else
                return Boom.unauthorized('Unauthorized')

            // const decodedToken = await jwt.verify(token, process.env.SECRET_KEY, async (err, decodedToken) => {
            //     if (err) {
            //         console.log(err.message)
            //         return 'Invalid token'
            //     } else {
            //         // console.log(decodedToken)

            //         const db = await dbConnect('auth')
            //         const data = await db.aggregate([
            //             {
            //                 $match: {
            //                     user: mongodb.ObjectId(decodedToken.payload.user),
            //                     access_token: decodedToken.payload.access_token
            //                 }
            //             }
            //         ]).toArray()

            //         console.log(data)
            //         if (data.length) {
            //             console.log("in if")
            //             return res.response('Token Validated').code(200)
            //         }
            //         else {
            //             console.log("in else")
            //             return Boom.unauthorized('Unauthorized')
            //         }
            //     }
            // })
        }
        else {
            return Boom.unauthorized('Unauthorized')
        }
    } catch (e) {
        console.log(e)
        return Boom.unauthorized('Unauthorized')
    }

}

module.exports = { requireAuth }