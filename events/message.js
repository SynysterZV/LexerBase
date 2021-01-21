module.exports = (client, message) => {
    if (message.author.bot) return;
        
            const { cmd, args } = client.getCommand(message);

            try {
                cmd.execute(message, args)
            } catch (e) {
                console.log(e)
            }
}