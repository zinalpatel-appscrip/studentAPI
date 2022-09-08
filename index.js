const Hapi = require('@hapi/hapi')
const router = require('./router/route')
const db = require('./db/conn')

require('dotenv').config()

const options = {
    info: {
        'title': 'Student API',
        'version': '0.0.1',
        'contact': {
            name: "Appscrip", 
            email: "appscrip@web.com",
            // url: "web.com", // your website
        },
    },
    grouping: 'tags',

};

const init = async () => {

    const server = Hapi.server({
        port: process.env.CONNECTION_PORT,
        host: process.env.CONNECTION_HOST
    })
    
    await server.register([
        {
            plugin: require('@hapi/inert')
        },
        {
            plugin: require('@hapi/vision')
        },
        {
            plugin: require('hapi-swagger'),
            options: options
        }
    ])

    await server.start()
    await db.dbConnect()
    server.route(router)
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()

