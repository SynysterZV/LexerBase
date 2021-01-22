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
        delete this.config.keyring.discord
        this.commands = new Collection()
        const dirs = config.dirs

        this.load = (p) => {
        if(p) {
            const module = require(p)
            const command = this.commands.get(module.name)
            command.set('module', module)
            return delete require.cache[require.resolve(p)]
        }
        fs.readdir(dirs.commands, { withFileTypes: true }, (err, files) => {
            if(err) throw err
            const folders = files.filter(f=> f.isDirectory())
            if(!folders) {
                const jsfiles = files.filter(f => f.name.endsWith('.js'))
                jsfiles.forEach(file => {
                    const pathTo = path.join(dirs.commands, file.name)
                    const module = require(pathTo)
                    this.commands.set(module.name, new Collection())
                    const mod = this.commands.get(module.name)
                    mod.set('fullPath', pathTo)
                    mod.set('module', module)
                    delete require.cache[require.resolve(pathTo)]
                })
            }
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

        this.init = () => {
            this.load()
            this.loadEvents()
            this.login()
        }

        this.getCommand = (message) => {
            const args = message.content.slice(this.config.prefix.length).split(/\s+/)
            const commandName = args.shift().trim()
            const command = this.commands.get(commandName)
            const mod = command.get('module')
            const modPath = command.get('fullPath')

            return { command: { cmd: mod, path: modPath }, args }
        } 
    }
}