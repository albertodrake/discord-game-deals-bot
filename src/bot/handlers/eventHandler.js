// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const fs = require('fs');
const path = require('path');

/**
 * Dynamically loads and sets up Discord event listeners.
 * @param {import('discord.js').Client} client 
 */
module.exports = (client) => {
    const handlersPath = path.join(__dirname, '../events');
    if (!fs.existsSync(handlersPath)) {
        fs.mkdirSync(handlersPath);
    }

    const eventFiles = fs.readdirSync(handlersPath).filter(file => file.endsWith('.js'));

    for (const file of eventFiles) {
        const filePath = path.join(handlersPath, file);
        const event = require(filePath);
        if (event.once) {
            client.once(event.name, (...args) => event.execute(...args, client));
        } else {
            client.on(event.name, (...args) => event.execute(...args, client));
        }
    }
};
