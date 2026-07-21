require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
let db;

async function connectDB() {
    if (db) return db;
    await client.connect();
    db = client.db('lich3dDB');
    console.log('Connected to MongoDB');
    return db;
}

module.exports = connectDB;