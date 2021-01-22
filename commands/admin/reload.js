const path = require('path')
module.exports = {
    name: 'reload',
    desc: 'Reloads commands',
    async execute(message, args) {
        const cmdName = args[0].toLowerCase()
        const command = message.client.commands.get(cmdName)
        if(!command) return message.reply('There is no command with that name')

        try {
            message.client.load(command.get('fullPath'))
            message.channel.send(`Command ${cmdName} sucessfully reloaded!`)
        } catch (e) {
            console.log(e)
        }
    }
}