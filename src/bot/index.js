// Created by Alberto Drake | GitHub: https://github.com/albertodrake
require('dotenv').config();
const { Client, GatewayIntentBits } = require('discord.js');
const eventHandler = require('./handlers/eventHandler');
const commandHandler = require('./handlers/commandHandler');
const SchedulerService = require('../services/scheduler');
const logger = require('../services/logger');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

// Load everything
(async () => {
    logger.info('Initializing bot...');
    
    // Register event handlers
    eventHandler(client);
    
    // Register slash commands
    await commandHandler(client);
    
    // Initialize Scheduler
    const scheduler = new SchedulerService(client);
    scheduler.start();
    
    // Login
    client.login(process.env.BOT_TOKEN);
})();

// Global error handling
process.on('unhandledRejection', error => {
    logger.error(error, 'Unhandled Promise Rejection');
});
