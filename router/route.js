const adminController = require('../controller/adminController')
const login = require('../controller/login')
const logout = require('../controller/logout')
const requireAuth = require('../middleware/requireAuth')
const studentController = require('../controller/studentController')
const Joi = require('joi')
const validate = require('../middleware/validate')

module.exports = [
    {
        method: 'POST',
        path: '/api/studentAdmin',
        // pre: requireAuth(),
        // config: {
            // handler: adminController.insertData,
            // description: 'API for adding Admin info. ',
            // notes: 'It does not require Login. Pass Email,Password,Name & Phone.',
            // tags: ['admin', 'api'],
            // plugins: {
            //     'hapi-swagger': {
            //         responses: {
            //             201: {
            //                 description: 'This status code will be returned if Details are successfully inserted!',
            //                 schema: Joi.object({
            //                     message: Joi.string().example('Data Inserted!!')
            //                 })
            //             },
            //             // 204: undefined, // pass-through "No Content" to swagger definition
            //             409: {
            //                 description: 'It will be returned if payload does not statisfy all validations.',
            //                 schema: Joi.object({
            //                     message: Joi.string().example('email must be a valid email')
            //                 })
            //             }
            //         }
            //     }
            // },
            
            
                // headers: Joi.object({
                //     'authorization': Joi.string().required()
                // }).unknown()
            
        
        options: {
            handler: adminController.insertData,
            description: 'API for adding Admin info. ',
            notes: 'It does not require Login. Pass Email,Password,Name & Phone.',
            tags: ['admin', 'api'],
            validate: {
                // params: Joi.object({
                //     pageNo: Joi.number()
                // }),
                payload: validate.UserJoiSchema,
                // failAction: (req, reply, source, error) => {
                //     // return reply({ message: error.output.payload.message }).code(error.output.statusCode);
                //     console.log(error)
                // }
                // failAction: 'error',
                // response: {"statusCode":400,"error":"Bad Request","message":"Invalid request query input"}
                // failAction: 'log',
                // log to console: Error: Invalid request query input
                failAction(request, h, err) {
                    request.log('error', err.message)
                    throw err;
                },

            },
             plugins: {
                'hapi-swagger': {
                    responses: {
                        201: {
                            description: 'This status code will be returned if Details are successfully inserted!',
                            schema: Joi.object({
                                message: Joi.string().example('Data Inserted!!')
                            })
                        },
                        // 204: undefined, // pass-through "No Content" to swagger definition
                        409: {
                            description: 'It will be returned if payload does not statisfy all validations.',
                            schema: Joi.object({
                                message: Joi.string().example('email must be a valid email')
                            })
                        }
                    }
                }
            },
            
        }
    },
    {
        method: 'POST',
        path: '/api/login',
        // pre: requireAuth(),
        config: {
            handler: login.login,
            description: 'API for LogIn. ',
            tags: ['authentication', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'This status code will be returned if User Succesfully Logs In',
                            schema: Joi.object({
                                message: Joi.string().example('Logged In!').required(),
                                token: Joi.string().example('JWT Token').required()
                            })
                        },
                        // 204: undefined, // pass-through "No Content" to swagger definition
                        409: {
                            description: 'It will be returned if Credentials are Invalid.',
                            schema: Joi.object({
                                message: Joi.string().example('Invalid Credentials!!!').required()
                            })
                        }
                    }
                }
            },
        }

    },
    {
        method: 'POST',
        path: '/api/students',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.insertStudentInfo,
            description: 'API for Inserting Student Info After LogIn. ',
            // notes: '',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        201: {
                            description: 'This status code will be returned if Details are successfully inserted!',
                            schema: Joi.object({
                                message: Joi.string().example('Student Created!!')
                            })
                        },
                        // 204: undefined, // pass-through "No Content" to swagger definition
                        409: {
                            description: 'It will be returned if payload does not statisfy all validations.',
                            schema: Joi.object({
                                message: Joi.string().example('addmission_date must be less than now')
                            })
                        }
                    }
                }
            },
        }
    },
    {
        method: 'PATCH',
        path: '/api/students/{id}',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.updateStudentInfo,
            description: 'API for updating Student Info After LogIn. ',
            // notes: '',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        201: {
                            description: 'This status code will be returned if Details are successfully updated!',
                            schema: Joi.object({
                                message: Joi.string().example('Data Updated!!')
                            })
                        },
                        // 204: undefined, // pass-through "No Content" to swagger definition
                        409: {
                            description: 'It will be returned if payload does not statisfy all validations.',
                            schema: Joi.object({
                                message: Joi.string().example('addmission_date must be less than now')
                            })
                        },
                        404: {
                            description: 'It will be returned if No data found with given student id',
                            schema: Joi.object({
                                message: Joi.string().example('requested student not found')
                            })
                        }
                    }
                }
            },
        }
    },
    {
        method: 'GET',
        path: '/api/students',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.getAllStudents,
            description: 'API for Searching All students ',
            notes: 'Search can done using either students name,email or phone. Or by passing above &/or below age. All keys will be passed as query params with pagination',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'This status code will be returned if Details are found.',
                            schema: Joi.object({
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
                        }
                    }
                }
            },
        }
    },
    {
        method: 'GET',
        path: '/api/students/{id}',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.getSpecificStudent,
            description: 'API for Searching Specific student',
            notes: 'Pass student id in request params.',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'This status code will be returned if Details are found.',
                            schema: Joi.object({
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
                        }
                    }
                }
            },
        }
    },
    {
        method: 'DELETE',
        path: '/api/students',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.deleteStudents,
            description: 'API for Deleting student records in bulk.',
            notes: 'Student Ids to be deleted will be passed as an array in request body.',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: {
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
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/logout',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: logout.logout,
            description: 'API for Logout',
            notes: 'Pass Valid JWT Token in Headers.',
            tags: ['authentication', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: {
                        200: {
                            description: 'This status code will be returned if User Succesfully Logs Out',
                            schema: Joi.object({
                                message: Joi.string().example('Logged Out!!!').required(),
                            })
                        },
                        // 204: undefined, // pass-through "No Content" to swagger definition
                        409: {
                            description: 'It will be returned if it does not find valid token.',
                            schema: Joi.object({
                                message: Joi.string().example('Something Went Wrong!!').required()
                            })
                        }
                    }
                }
            }
        }
    }
]