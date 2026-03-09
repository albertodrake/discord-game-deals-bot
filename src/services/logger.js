// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { WebhookClient, EmbedBuilder } = require('discord.js');

/**
 * Service to handle logging for the bot, including Discord webhooks.
 */
class LoggerService {
    constructor() {
        this.webhookClient = process.env.LOG_WEBHOOK_URL 
            ? new WebhookClient({ url: process.env.LOG_WEBHOOK_URL }) 
            : null;
    }

    /**
     * Log an information message.
     */
    info(message) {
        console.log(`[INFO] ${message}`);
    }

    /**
     * Log an error and notify via webhook if available.
     */
    async error(error, context = '') {
        console.error(`[ERROR] ${context ? `${context}: ` : ''}${error.message || error}`);
        
        if (this.webhookClient) {
            const embed = new EmbedBuilder()
                .setTitle('🚨 Bot Error')
                .setDescription(`**Context:** ${context || 'N/A'}\n**Error:** ${error.message || error}`)
                .setColor(0xFF0000)
                .setTimestamp();

            try {
                await this.webhookClient.send({ embeds: [embed] });
            } catch (webhookError) {
                console.error('Failed to send log to webhook:', webhookError.message);
            }
        }
    }

    /**
     * Log bot status updates (e.g., startup).
     */
    async status(message) {
        this.info(message);
        
        if (this.webhookClient) {
            const embed = new EmbedBuilder()
                .setTitle('🟢 Bot Status')
                .setDescription(message)
                .setColor(0x00FF00)
                .setTimestamp();

            await this.webhookClient.send({ embeds: [embed] });
        }
    }
}

module.exports = new LoggerService();
