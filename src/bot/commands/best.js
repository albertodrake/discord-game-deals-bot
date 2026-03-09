// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { SlashCommandBuilder } = require('discord.js');
const cheapSharkAPI = require('../../api/cheapshark');
const embedGenerator = require('../../utils/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('best')
        .setDescription('Get the best rated game deals.')
        .addIntegerOption(option =>
            option.setName('min_rating')
                .setDescription('Minimum Metacritic score (default 80)')),
                
    async execute(interaction) {
        await interaction.deferReply();
        
        const minRating = interaction.options.getInteger('min_rating') || 80;
        
        try {
            // Fetch deals sorted by Metacritic score
            const deals = await cheapSharkAPI.getDeals({ 
                sortBy: 'Metacritic', 
                pageSize: 30 // Fetch more to filter
            });
            
            const bestDeals = deals
                .filter(deal => parseInt(deal.metacriticScore) >= minRating)
                .slice(0, 5);
            
            if (bestDeals.length === 0) {
                return await interaction.editReply(`No deals found with a Metacritic score of ${minRating} or higher!`);
            }
            
            const embeds = await Promise.all(bestDeals.map(deal => embedGenerator(deal)));
            await interaction.editReply({ content: `**Top Rated Games (Metacritic ${minRating}+)**`, embeds });
            
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to fetch the best deals. Please try again later.');
        }
    },
};
