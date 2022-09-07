require('dotenv').config()

const { MongoClient } = require('mongodb')
const url = process.env.CONNECTION_URL
const client = new MongoClient(url)
let db

async function main() {
    try{
        let result = await client.connect()
        db = result.db('studentsAPI')
        // return db.collection(collectionName)
        // console.log(db)
        // console.log(`Database connected -- ${dbName}`)
    }catch(e)
    {
        console.log(e)
    }
}

// const dbObj = dbConnect()

exports.dbConnect = () => main()
exports.get = () => {return db}