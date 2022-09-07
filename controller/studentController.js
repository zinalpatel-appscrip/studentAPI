const db = require('../db/conn')
const validate = require('../middleware/validate')

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
    }
}