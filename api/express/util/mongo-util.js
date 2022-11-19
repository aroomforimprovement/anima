/* eslint-disable no-undef */
const { assert } = require('chai');
const { MongoClient } = require('mongodb');

const dbName = process.env.DB_NAME;
let client = null;
let database = null;

const uri = `${process.env.DB_URL_I}${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_URL_II}`;//?replicaSet=${process.env.DB_RS_NAME}`;

const here = 'util: mongo-util: ';

module.exports = {
    connectToServer: (callback) => {
        //const uri = `${process.env.DB_URL_I}${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_URL_II}`;//?replicaSet=${process.env.DB_RS_NAME}`;
        client = new MongoClient(uri);
        client.connect((err, dbObj) => {
            assert.equal(null, err);
            console.debug("Connected to mongodb server");
            database = dbObj.db(dbName);
            console.debug(`Connected to database: ${dbName}`);
            return callback(err, database);
        });
    },
    getDb: async () => {
        const sig = 'getDb: ';
        console.debug(`${here}${sig}`);
        if(database){
            console.debug(`${here}${sig}returning existing database connection`);
            return database;
        }else{
            console.debug(`${here}${sig}no existing database connection`);
            client = client ? client : await new MongoClient(uri).connect();
            console.debug(`${here}${sig}got client, getting db`);
            const db = await client.db(dbName);
            console.debug(`${here}${sig}got db, ${dbName}`);
            database = db;
            return db;
        }
    },
    getClient: async () => {
        const sig = 'getClient: ';
        console.debug(`${here}${sig}`);
        if(client){
            console.debug(`${here}${sig}returning existing client`);
            return client;
        }else{
            console.debug(`${here}${sig}no existing client`);
            client = await new MongoClient(uri).connect();
            console.debug(`${here}${sig}returning new client`);
            return client;
        }
    },
    transactionOptions: {
        readPreferences: 'primary',
        readConcern: { level: 'local' },
        writeConcern: { w: 'majority'},
        maxCommitTimeMS: 1000
    }
}