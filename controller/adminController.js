const dbConnect = require('../db/conn')
const validate = require('../middleware/validate')
let md5 = require('md5')
const jwt = require('jsonwebtoken')
const db = require('../db/conn')
require('dotenv').config()



module.exports = {
    //Insert Data in studentsAdmin
    insertData: async (req, h) => {
        try {
            let res = 'Error'
            const isValid = validate.validateUser(req.payload)
            // console.log(isValid.error)

            if (!isValid.error) {
                req.payload.password = md5(req.payload.password) 
                let result = await db.get().collection('studentAdmin').insertOne(req.payload)
                res = result.acknowledged ? "Data Inserted!!" : 'An error occured'
            }
            else {
                res = isValid.error.details
            }

            return res
        }
        catch (e) {
            // if (e.code === 11000)
            //     res.send("This email is already in use")
            // else
            console.log(e)
        }
    }
}