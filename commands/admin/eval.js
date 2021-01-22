const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'eval',
    desc: 'Evaluates code!',
    async execute(message, args) {
        if(message.author.id !== message.client.config.ownerID) return;
        const code = args.join().replace(/(^`{1,3}|(?<=```)js)|`{1,3}$/g, '').trim()

        let evaled = await eval(`(async () => {
            return ${code}
        })()`)

        if(typeof evaled !== 'string') {
            evaled = require('util').inspect(evaled, { depth: 0 })
        }

        const embed = new MessageEmbed()
            .setDescription(`**Input:**\`\`\`js\n${code}\`\`\`**Output:**\`\`\`js\n${evaled}\`\`\``)
        
        message.channel.send(embed);
    }
}