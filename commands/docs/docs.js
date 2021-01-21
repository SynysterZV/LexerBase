const fetch = require('node-fetch')
const qs = require('querystring')

module.exports = {
    name: 'docs',
    desc: 'DJS Docs!',
    async execute(message, args) {
        const query = args.join(' ')

        const queryString = qs.stringify({ src: 'stable', q: query, includePrivate: true})
        const embed = await fetch(`https://djsdocs.sorta.moe/v2/embed?${queryString}`).then(res => res.json());

        if(!embed) {
            message.channel.send('No Results!')
        }

        return message.channel.send({ embed })
    }
}