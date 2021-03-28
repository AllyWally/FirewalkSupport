const mongoose = require('mongoose');
const { MongoClient } = require('mongoose');

const config = require(`../data/mongo.json`)
module.exports = {
    init: () => {
        const dbOptions = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            reconnectTries: Number.MAX_VALUE,
            reconnectInterval: 500,
            poolSize: 5,
            connectTimeoutMS: 10000,
            family: 4
        };

        mongoose.connect(``)
        mongoose.Promise = global.Promise;
        mongoose.connection.on('connected', () => {
            console.log("Mongoose Connected")
        });

        mongoose.connection.on('err', () => {
            console.error(`Mongoose connection error: \n${err.stack}`)
        });
        
        mongoose.connection.on('disconnected', () => {
            console.warn('Mongoose connection lost')
        })
    }
}

