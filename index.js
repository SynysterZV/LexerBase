const Lex = require('./core/client');
const client = new Lex(require('./core/config.json'))
client.loadAll()
client.login()

// https://cn_lab_1_$.cdr.co/