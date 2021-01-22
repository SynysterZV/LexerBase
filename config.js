const path = require('path')

module.exports = {
    keyring: {
        discord: 'Token',
    },
    ownerID: '372516983129767938',
    prefix: '?',
    dirs: {
        commands: path.join(__dirname, 'commands'),
        events: path.join(__dirname, 'events')
    }
}