// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { Events } = require('discord.js');
const logger = require('../../services/logger');

module.exports = {
    name: Events.ClientReady,
    once: true,
    execute(client) {
        logger.status(`Ready! Logged in as ${client.user.tag}`);
    },
};
