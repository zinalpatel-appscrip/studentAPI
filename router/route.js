const adminController = require('../controller/adminController')
const login = require('../controller/login')
const requireAuth = require('../middleware/requireAuth')
const studentController = require('../controller/studentController')


module.exports = [
    {
        method: 'POST',
        path: '/api/studentAdmin',
        // pre: requireAuth(),
        config: {           
            handler: adminController.insertData
        }
            
    },
    {
        method: 'POST',
        path: '/api/login',
        // pre: requireAuth(),
        config: {
            handler: login.login
        },
    },
    {
        method: 'POST',
        path: '/api/students',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.insertStudentInfo
        }
    },
    {
        method: 'PATCH',
        path: '/api/students/{id}',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.updateStudentInfo
        }
    },
    {
        method: 'GET',
        path: '/api/students',
        config: {
            pre: [
                { method: requireAuth.requireAuth }
            ],
            handler: studentController.getAllStudents
        }
    }
]