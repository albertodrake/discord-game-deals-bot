// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { PrismaClient } = require('@prisma/client');

/**
 * Service to handle database operations using Prisma.
 */
class DatabaseService {
    constructor() {
        if (!process.env.DATABASE_URL) {
            console.error('[ERROR] DATABASE_URL is not defined in .env! Database features will not work.');
        }
        this.prisma = new PrismaClient();
        this.initialize();
    }

    /**
     * Automatically creates the required tables if they don't exist.
     * Useful for hosting environments where CLI access is restricted.
     */
    async initialize() {
        try {
            await this.prisma.$executeRawUnsafe(`
                CREATE TABLE IF NOT EXISTS GuildSettings (
                    id VARCHAR(191) PRIMARY KEY,
                    dealsChannelId VARCHAR(191),
                    freebiesChannelId VARCHAR(191),
                    minSavings INTEGER DEFAULT 0
                )
            `);
            console.log('[DB] Database tables initialized successfully.');
        } catch (error) {
            console.error('[DB] Error initializing database tables:', error);
        }
    }

    /**
     * Get settings for a specific guild.
     * @param {string} guildId 
     */
    async getSettings(guildId) {
        return await this.prisma.guildSettings.findUnique({
            where: { id: guildId }
        });
    }

    /**
     * Update or create settings for a guild.
     * @param {string} guildId 
     * @param {Object} data 
     */
    async updateSettings(guildId, data) {
        return await this.prisma.guildSettings.upsert({
            where: { id: guildId },
            update: data,
            create: {
                id: guildId,
                ...data
            }
        });
    }

    /**
     * Get all guilds that have a specific channel configured.
     */
    async getAllConfiguredGuilds() {
        return await this.prisma.guildSettings.findMany();
    }
}

module.exports = new DatabaseService();