// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const cheapSharkAPI = require('../api/cheapshark');
const epicGamesAPI = require('../api/epic');
const embedGenerator = require('../utils/embedGenerator');
const dbService = require('./db');

/**
 * Scheduler service to handle automatic deal posting.
 */
class SchedulerService {
    constructor(client) {
        this.client = client;
    }

    /**
     * Start all scheduled tasks.
     */
    start() {
        // Daily deals at 10:00 AM
        cron.schedule('0 10 * * *', () => {
            this.postDailyDeals();
        });

        // Weekly free games on Thursday at 9:00 PM (typical Epic schedule)
        cron.schedule('0 21 * * 4', () => {
            this.postFreebies();
        });

        console.log('Scheduler service started.');
    }

    /**
     * Fetch and post daily deals to configured channels.
     */
    async postDailyDeals() {
        try {
            const guildSettings = await dbService.getAllConfiguredGuilds();
            if (guildSettings.length === 0) return;

            const deals = await cheapSharkAPI.getDeals({ sortBy: 'Savings', pageSize: 30 }); // Fetch more for filtering

            for (const settings of guildSettings) {
                const channelId = settings.dealsChannelId;
                if (!channelId) continue;

                const minSavings = settings.minSavings || 0;
                const filteredDeals = deals.filter(deal => deal.savings >= minSavings).slice(0, 5);

                if (filteredDeals.length === 0) continue;

                const embeds = await Promise.all(filteredDeals.map(deal => embedGenerator(deal)));
                const channel = await this.client.channels.fetch(channelId);
                if (channel) {
                    await channel.send({ content: `🔔 **Daily Game Deals (${minSavings}%+ Off) are here!**`, embeds });
                }
            }
        } catch (error) {
            console.error('Error in daily deals scheduler:', error);
        }
    }

    /**
     * Fetch and post free games.
     */
    async postFreebies() {
        try {
            const guildSettings = await dbService.getAllConfiguredGuilds();
            if (guildSettings.length === 0) return;

            const games = await epicGamesAPI.getFreeGames();
            if (games.length === 0) return;

            const embeds = games.map(game => {
                return new EmbedBuilder()
                    .setTitle(game.title)
                    .setURL(game.url)
                    .setDescription(game.description || 'No description available.')
                    .setImage(game.thumb)
                    .setColor(0x000000)
                    .addFields({ name: 'Original Price', value: game.originalPrice || 'Free' })
                    .setFooter({ text: 'Epic Games Store Freebie | Developed with ❤️' })
                    .setTimestamp();
            });

            for (const settings of guildSettings) {
                const channelId = settings.freebiesChannelId;
                if (!channelId) continue;

                const channel = await this.client.channels.fetch(channelId);
                if (channel) {
                    await channel.send({ content: '🎁 **New Free Games are available!**', embeds });
                }
            }
        } catch (error) {
            console.error('Error in freebies scheduler:', error);
        }
    }
}

module.exports = SchedulerService;
