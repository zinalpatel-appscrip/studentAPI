const Joi = require('joi')


//studentAdmin
const studentAdminRes = {
    201: {
        description: 'This status code will be returned if Details are successfully inserted!',
            schema: Joi.object({
                message: Joi.string().example('Data Inserted!!')
            })
    },
    400: {
        description: 'Bad request while some data is missing or invalid.',
            schema: Joi.object({
                statusCode: Joi.number().example(400),
                error: Joi.string().example('Bad Request'),
                message: Joi.string().example('email must be a valid email')
            })
    }
}

//Login
const loginRes = {
    200 : {
        description: 'This status code will be returned if User Succesfully Logs In',
            schema: Joi.object({
                message: Joi.string().example('Logged In!').required(),
                token: Joi.string().example('JWT Token').required()
            })
    },
    400: {
        description: 'Bad request while some data is missing or invalid.',
            schema: Joi.object({
                statusCode: Joi.number().example(400),
                error: Joi.string().example('Bad Request'),
                message: Joi.string().example('email must be a valid email')
            })
    },
    401: {
        description: 'If email or password is incorrect.',
            schema: Joi.object({
                message: Joi.string().example('Invalid Credentials!!!')
            })
    }
}

//Student Insert
const StudentInsertRes = {
    201: {
        description: 'This status code will be returned if Details are successfully inserted!',
            schema: Joi.object({
                message: Joi.string().example('Student Created!!')
            })
    },
    400: {
        description: 'Bad request while some data is missing or invalid.',
            schema: Joi.object({
                statusCode: Joi.number().example(400),
                error: Joi.string().example('Bad Request'),
                message: Joi.string().example('admission_date must be less than now')
            })
    },
    401: {
        description: 'If provided token is invalid or not provided.',
            schema: Joi.object({
                statusCode: Joi.number().example(401),
                error: Joi.string().example('Unauthorized'),
                message: Joi.string().example('Unauthorized')
            })
    },
}


//Student Update
const StudentUpadteRes = {
    200: {
        description: 'This status code will be returned if Details are successfully updated!',
            schema: Joi.object({
                message: Joi.string().example('Data Updated!!')
            })
    },
    401: {
        description: 'If provided token is invalid or not provided.',
            schema: Joi.object({
                statusCode: Joi.number().example(401),
                error: Joi.string().example('Unauthorized'),
                message: Joi.string().example('Unauthorized')
            })
    },
    404: {
        description: 'It will be returned if No data found with given student id',
            schema: Joi.object({
                message: Joi.string().example('requested student not found')
            })
    },
    401: {
        description: 'If provided token is invalid or not provided.',
            schema: Joi.object({
                statusCode: Joi.number().example(401),
                error: Joi.string().example('Unauthorized'),
                message: Joi.string().example('Unauthorized')
            })
    }

}


//Get all students
const GetAllStudentsRes =  {
        200: {
            description: 'This status code will be returned if Details are found.',
            schema: Joi.object({
                message: Joi.string().example('Data Found!!'),
                data: Joi.array().example([
                    {
                        "_id": "63196f322ee2e759e0f0f9a1",
                        "name": "s1",
                        "email": "s1@email.com",
                        "phone": "454545",
                        "preferedSubject": [
                            "Maths",
                            "Science"
                        ],
                        "age": 22,
                        "isPresent": true,
                        "addmission_date": "1-1-2000",
                        "leaving_date": "1-1-2021",
                        "contact_person_details": {
                            "relation": "father",
                            "contact": "89845555"
                        },
                        "timing": {
                            "entry_time": "08:30",
                            "exit_time": "05:00"
                        }
                    },
                ])
            })
                            },
        401: {
                description: 'If provided token is invalid or not provided.',
                schema: Joi.object({
                    statusCode: Joi.number().example(401),
                    error: Joi.string().example('Unauthorized'),
                    message: Joi.string().example('Unauthorized')
                })
            }
}

//Get specific student
const getSpecificStudentRes = {
    200: {
        description: 'This status code will be returned if Details are found.',
            schema: Joi.object({
                message: Joi.string().example('Data Found!!'),
                data: Joi.array().example([
                    {
                        "_id": "63196f322ee2e759e0f0f9a1",
                        "name": "s1",
                        "email": "s1@email.com",
                        "phone": "454545",
                        "preferedSubject": [
                            "Maths",
                            "Science"
                        ],
                        "age": 22,
                        "isPresent": true,
                        "addmission_date": "1-1-2000",
                        "leaving_date": "1-1-2021",
                        "contact_person_details": {
                            "relation": "father",
                            "contact": "89845555"
                        },
                        "timing": {
                            "entry_time": "08:30",
                            "exit_time": "05:00"
                        }
                    },
                ])
            })
    },
    404: {
        description: 'This status code will be returned if NO Details are found.',
            schema: Joi.object({
                message: Joi.string().example("This student is not exsists")
            })
    },
    401: {
        description: 'If provided token is invalid or not provided.',
            schema: Joi.object({
                statusCode: Joi.number().example(401),
                error: Joi.string().example('Unauthorized'),
                message: Joi.string().example('Unauthorized')
            })
    }
}


const deleteStudentsRes = {
    200: {
        description: 'Returned If Data Succesfully deleted',
            schema: Joi.object({
                message: Joi.string().example('Data deleted successfully').required()
            })
    },
    // 204: undefined, // pass-through "No Content" to swagger definition
    404: {
        description: 'No student found.',
            schema: Joi.object({
                message: Joi.string().example('No data found').required()
            })
    },
    500: {
        description: 'This error occur while internal server error.',
            schema: Joi.object({
                message: Joi.string().example('Internal server error').required()
            })
    }
}

module.exports = { studentAdminRes, loginRes, StudentInsertRes, StudentUpadteRes, GetAllStudentsRes, getSpecificStudentRes, deleteStudentsRes }