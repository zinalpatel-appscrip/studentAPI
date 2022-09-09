const db = require('../db/conn')
const validate = require('../middleware/validate')
const mongodb = require('mongodb')


module.exports = {
    insertStudentInfo: async (req, h) => {
        try {
            //validate student info
            let res = 'Error'
            // const isValid = validate.validateStudent(req.payload)

            // if (!isValid.error) {
                const result = await db.get().collection('studentInfo').insertMany([req.payload])
                res = result.acknowledged ? "Student Created!!" : 'An error occured'
                return h.response({ message: res }).code(201)
            // }
            // else {
            //     res = isValid.error.details[0].message
            //     return h.response({ message: res }).code(409) //Conflict
            // }

        } catch (e) {
            console.log(e)
        }
    },
    //Update Student
    updateStudentInfo: async (req, h) => {
        try {
            let res = 'Error'
            //check if resouse exsists
            let data = await db.get().collection('studentInfo').findOne({ _id: mongodb.ObjectId(req.params.id) })
            // console.log(data)
            if (data) {
                // const isValid = validate.validateStudent(req.payload)
                // if (!isValid.error) {
                    let result = await db.get().collection('studentInfo').updateOne({ _id: mongodb.ObjectId(req.params.id) }, { $set: req.payload })
                    res = 'Data Updated!!'
                    return h.response({ message: res }).code(200)
                // }
                // else {
                //     res = isValid.error.details
                //     return h.response({ message: res }).code(409) //Conflict
                // }
            }
            else {
                res = 'requested student not found'
                return h.response({ message: res }).code(404)
            }

        }
        catch (e) {
            console.log(e)
        }
    },
    //search all students with filter
    getAllStudents: async (req, h) => {

        try {
            // const data = req.params.filter
            const name = req.query.name
            const email = req.query.email
            const phone = req.query.phone
            let above = req.query.above
            let below = req.query.below

            // console.log(age)
            if (name || email || phone) {
                let result = await db.get().collection('studentInfo').aggregate([
                    {
                        $match: {
                            $or: [{ name: name }, { email: email }, { phone: phone }]
                        }
                    }
                ]).toArray()

                return h.response({ data: result }).code(200)
            }

            if (above || below) {

                if (!above) above = 0
                if (!below) below = Number.MAX_SAFE_INTEGER

                let result = await db.get().collection('studentInfo').aggregate([
                    {
                        $match: {
                            $and: [{ age: { $gt: Number(above) } }, { age: { $lt: Number(below) } }]
                        }
                    },
                    {
                        $skip: (req.query.page - 1) * 3 //per page 3 records
                    },
                    {
                        $limit: 3
                    }
                ]).toArray()

                return h.response({ data: result }).code(200)
            }

        } catch (e) {
            console.log(e)
        }


    },
    getSpecificStudent: async (req, h) => {
        try {
            const id = req.params.id

            const student = await db.get().collection('studentInfo').find({
                _id: mongodb.ObjectId(id)
            }).toArray()

            if (student.length)
                return h.response({ data: student }).code(200)
            else
                return h.response({ message: "This student is not exsists" }).code(404)
        } catch (e) {
            console.log(e)
        }
    },
    //delete students
    deleteStudents: async (req, h) => {
        const ids = req.payload.ids

        let objectids = ids.map(id => mongodb.ObjectId(id))
        const result = await db.get().collection('studentInfo').deleteMany({ _id: { $in: objectids } })

        if(result.deletedCount)
            return h.response({message: 'Data deleted successfully'}).code(200)
        else if (result.deletedCount === 0)
            return h.response({ message: 'No data found' }).code(404)
        else
            return h.response({ message: 'Internal Server Error' }).code(500)
    }
}