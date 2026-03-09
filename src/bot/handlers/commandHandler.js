const fs = require('fs');
const path = require('path');
// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { REST, Routes, Collection } = require('discord.js');

/**
 * Dynamically loads and registers slash commands.
 * @param {import('discord.js').Client} client 
 */
module.exports = async (client) => {
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, '../commands');
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

    const commands = [];

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
            commands.push(command.data.toJSON());
        } else {
            console.warn(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }

    const rest = new REST().setToken(process.env.BOT_TOKEN);

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        // Register global commands
        await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            { body: commands },
        );

        console.log(`Successfully reloaded application (/) commands.`);
    } catch (error) {
        console.error('Error registering slash commands:', error);
    }
};
