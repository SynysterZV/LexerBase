// Config file dir
const config = require('./config');

const Client = require('./core/client');
const client = new Client(config)

client.init()