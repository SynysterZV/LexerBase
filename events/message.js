module.exports = (client, message) => {
    if (message.author.bot) return;
        
            const { command, args } = client.getCommand(message);

            try {
                command.cmd.execute(message, args, command)
            } catch (e) {
                console.log(e)
            }
}