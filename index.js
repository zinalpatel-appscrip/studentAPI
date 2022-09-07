const Hapi = require('@hapi/hapi')
const router = require('./router/route')
const db = require('./db/conn')

require('dotenv').config()

const init = async () => {

    const server = Hapi.server({
        port: process.env.CONNECTION_PORT,
        host: process.env.CONNECTION_HOST
    })
    
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

