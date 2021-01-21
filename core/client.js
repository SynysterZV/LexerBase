const { Client, Collection } = require('discord.js')
const fs = require('fs')
const path = require('path')

module.exports = class extends Client {
    constructor(config) {
        super({
            ws: {
                properties: {
                    $browser: 'Discord iOS'
                }
            }
        })
        this.config = config
        this.token = config.keyring.discord
        this.commands = new Collection()
        const dirs = {
            commands: path.join(__dirname,'..', 'commands'),
            events: path.join(__dirname, '..', 'events')
        }

        this.load = () => {
        fs.readdir(dirs.commands, { withFileTypes: true }, (err, files) => {
            if(err) throw err
            const folders = files.filter(f=> f.isDirectory())
            folders.forEach(folder => {
                fs.readdir(path.join(dirs.commands, folder.name), (err, files) => {
                    if(err) throw err
                    const jsfiles = files.filter(f=> f.endsWith('.js'))
                    jsfiles.forEach(file => {
                        const pathTo = path.join(dirs.commands, folder.name, file)
                        const module = require(pathTo)
                        this.commands.set(module.name, new Collection())
                        const mod = this.commands.get(module.name)
                        mod.set('fullPath', pathTo)
                        mod.set('module', module)
                        delete require.cache[require.resolve(pathTo)]
                    })
                })
            })
        })
    }

        this.loadEvents = () => {
            fs.readdir(dirs.events, (err, files) => {
                if(err) throw err
                const jsfiles = files.filter(f => f.endsWith('.js'))
                jsfiles.forEach(file => {
                    const pathTo = path.join(dirs.events, file)
                    const event = require(pathTo)
                    const eventName = file.split('.')[0]
                    this.on(eventName, event.bind(null, this))
                    delete require.cache[require.resolve(pathTo)]
                })
            })
        }

        this.loadAll = () => {
            this.load()
            this.loadEvents()
        }

        this.getCommand = (message) => {
            const args = message.content.slice(this.config.prefix.length).split(/\s+/)
            const commandName = args.shift().trim()
            const command = this.commands.get(commandName)
            const mod = command.get('module')
            const modPath = command.get('fullPath')

            return { cmd: mod, path: modPath, args }
        } 
    }
}