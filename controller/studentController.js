const db = require('../db/conn')
const validate = require('../middleware/validate')
const mongodb = require('mongodb')


module.exports = {
    insertStudentInfo: async (req,h) => {
        try {            
            //validate student info
            let res = 'Error'
            const isValid = validate.validateStudent(req.payload)

            if(!isValid.error)
            {
                const result = await db.get().collection('studentInfo').insertMany([req.payload])
                res = result.acknowledged ? "Student Created!!" : 'An error occured'
                return h.response(res).code(201)
            }    
            else
            {
                res = isValid.error.details
                return h.response(res).code(409) //Conflict
            }
            
        } catch (e) {
            console.log(e)
        }
    },
    //Update Student
    updateStudentInfo: async (req,h) => {
        try {
            let res = 'Error'
            //check if resouse exsists
            let data = await db.get().collection('studentInfo').findOne({ _id:  mongodb.ObjectId(req.params.id) })
            // console.log(data)
            if(data)
            {
                const isValid = validate.validateStudent(req.payload)
                if (!isValid.error) {
                    let result = await db.get().collection('studentInfo').updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.payload })
                    res = 'Data Updated!!'
                    return h.response(res).code(200)
                }
                else {
                    res = isValid.error.details
                    return h.response(res).code(409) //Conflict
                }
            }
            else
            {
                res = 'requested student not found'
                return h.response(res).code(404)
            }
            
        }
        catch (e) {
            console.log(e)
        }
    },
    //search all students with filter
    getAllStudents: async (req,h) => {

        try{
            // const data = req.params.filter
            const name = req.query.name
            const email = req.query.email
            const phone = req.query.phone
            const above = req.query.above
            const below = req.query.below

            // console.log(age)
            if (name || email || phone) {
                let result = await db.get().collection('studentInfo').aggregate([
                    {
                        $match: {
                            $or: [{ name: name }, { email: email }, { phone: phone }]
                        }
                    }
                ]).toArray()

                return h.response(result).code(200)
            }
            
            if (above || below) {
                // const above = age.above
                // console.log(typeof age)
                console.log(above)
                console.log(below)
                let result = await db.get().collection('studentInfo').aggregate([
                    {
                        $match: {
                            $and: [{ age: { $gt: above } }, { age: { $lt: below } }]
                        }
                    }
                ]).toArray()

                return h.response(result).code(200)
            }

        }catch(e)
        {
            console.log(e)
        }

        
    }
    
}