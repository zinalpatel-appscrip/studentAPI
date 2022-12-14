const Hapi = require('@hapi/hapi')
const router = require('./router/route')
const db = require('./db/conn')
const i18n = require('i18n')
const path = require('path')

require('dotenv').config()

i18n.configure({
    directory: path.join(__dirname,'./locales'),
    objectNotation: true
})

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

    await server.start((req, res) => i18n.init(req, res))
    await db.dbConnect()
    server.route(router)
    console.log('Server running on %s', server.info.uri)
}

process.on('unhandledRejection', (err) => {
    console.log(err)
    process.exit(1)
})

init()

