const adminController = require('../controller/adminController')
const login = require('../controller/login')
const logout = require('../controller/logout')
const requireAuth = require('../middleware/requireAuth')
const studentController = require('../controller/studentController')
const Joi = require('joi')
const validate = require('../middleware/validate')
const Boom = require('@hapi/boom')
const responses = require('../config/response')

module.exports = [
    //Student Admin Data
    {
        method: 'POST',
        path: '/api/studentAdmin',    
        options: {
            handler: adminController.insertData,
            description: 'API for adding Admin info. ',
            notes: 'It does not require Login. Pass Email,Password,Name & Phone.',
            tags: ['admin', 'api'],
            validate: {
                payload: validate.UserJoiSchema,
                headers: Joi.object({
                    'accept-language': Joi.string().required()
                }).unknown(),
                failAction(request, h, err) {
                    // console.log(err)
                    // console.log(request)
                    return Boom.badRequest(`${err.details[0].message}`)
                }
            },
            plugins: {
                'hapi-swagger': {
                     responses: responses.studentAdminRes
                 }
            },
        }
    },

    //Login
    {
        method: 'POST',
        path: '/api/login',
        // pre: requireAuth(),
        options: {
            handler: login.login,
            description: 'API for LogIn. ',
            tags: ['authentication', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: responses.loginRes
                }
            },
            validate:{
                payload: Joi.object({
                    email:Joi.string().email().required(),
                    password: Joi.string().required()
                }),
                headers: Joi.object({
                    'accept-language': Joi.string().required()
                }).unknown(),
                failAction(request, h, err) {
                    return Boom.badRequest(`${err.details[0].message}`)
                }   
            } 
        }

    },

    //Student Insert
    {
        method: 'POST',
        path: '/api/students',
        options: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.insertStudentInfo,
            description: 'API for Inserting Student Info After LogIn. ',
            // notes: '',
            tags: ['students', 'api'],
            validate: {
                payload: validate.StudentJoiSchema,
                failAction(request, h, err) {//
                    return Boom.badRequest(`${err.details[0].message}`)
                },
                headers: Joi.object({
                    'token': Joi.string().required(),
                    'accept-language': Joi.string().required()
                }).unknown()
            }, 
            plugins: {
                'hapi-swagger': {
                    responses: responses.StudentInsertRes
                },
                validate: {
                    payload: validate.StudentJoiSchema,
                    failAction(request, h, err) {//
                        return Boom.badRequest(`${err.details[0].message}`)
                    },
                    headers: Joi.object({
                        'token': Joi.string().required()
                    }).unknown()
                }  
            }
        }
    },

    //Update Student
    {
        method: 'PATCH',
        path: '/api/students/{id}',
        options: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.updateStudentInfo,
            description: 'API for updating Student Info After LogIn. ',
            // notes: '',
            tags: ['students', 'api'],
            validate: {
                payload: validate.StudentJoiSchema,
                failAction(request, h, err) {
                    console.log(err)
                    return Boom.badRequest(`${err.details[0].message}`)
                },
                headers: Joi.object({
                    'token': Joi.string().required(),
                    'accept-language': Joi.string().required()
                }).unknown(),
                params: Joi.object({
                    id: Joi.string()
                })
            },
            plugins: {
                'hapi-swagger': {
                    responses: responses.StudentUpadteRes,
                }
            },
        }
    },

    //API for search all students
    {
        method: 'GET',
        path: '/api/students',
        options: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.getAllStudents,
            description: 'API for Searching All students ',
            notes: 'Search can done using either students name,email or phone. Or by passing above &/or below age. All keys will be passed as query params with pagination',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: responses.GetAllStudentsRes,
                    validate: {
                        headers: Joi.object({
                            'token': Joi.string().required(),
                            'accept-language': Joi.string().required()
                        }).unknown(),
                        query: Joi.object({
                            name: Joi.string(),
                            email: Joi.string(),
                            phone: Joi.string(),
                            above: Joi.string(),
                            below: Joi.string(),
                            page: Joi.string()
                        })
                    },
                }
            },
        }
    },

    //API for getting specific student detail
    {
        method: 'GET',
        path: '/api/students/{id}',
        options: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.getSpecificStudent,
            description: 'API for Searching Specific student',
            notes: 'Pass student id in request params.',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: responses.getSpecificStudentRes,
                    validate: {
                        headers: Joi.object({
                            'token': Joi.string().required(),
                            'accept-language': Joi.string().required()
                        }).unknown(),
                        params: Joi.object({
                            id: Joi.string()
                        })
                    },
                }
            }
        }
    },

    //API for deleting Students
    {
        method: 'DELETE',
        path: '/api/students',
        options: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.deleteStudents,
            description: 'API for Deleting student records in bulk.',
            notes: 'Student Ids to be deleted will be passed as an array in request body.',
            tags: ['students', 'api'],
            plugins: {
                'hapi-swagger': {
                    responses: responses.deleteStudentsRes,
                    validate: {
                        headers: Joi.object({
                            'token': Joi.string().required(),
                            'accept-language': Joi.string().required()
                        }).unknown(),
                        payload: Joi.object({
                            ids: Joi.array()
                        })
                    }
                }
            }
        }
    },

    //Logout
    {
        method: 'GET',
        path: '/api/logout',
        options: {
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
                        401: {
                            description: 'If provided token is invalid or not provided.',
                            schema: Joi.object({
                                statusCode: Joi.number().example(401),
                                error: Joi.string().example('Unauthorized'),
                                message: Joi.string().example('Unauthorized')
                            })
                        },
                    },
                    validate: {
                        headers: Joi.object({
                            'token': Joi.string().required(),
                            'accept-language': Joi.string().required()
                        }).unknown()

                        // failAction(request, h, err) {
                        //     return Boom.badRequest(`${err.details[0].message}`)
                        // }
                    } 
                }
               
            }
        }
    }
]