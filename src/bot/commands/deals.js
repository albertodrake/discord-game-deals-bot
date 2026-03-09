// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { SlashCommandBuilder } = require('discord.js');
const cheapSharkAPI = require('../../api/cheapshark');
const embedGenerator = require('../../utils/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('deals')
        .setDescription('Get the latest game deals.')
        .addStringOption(option =>
            option.setName('store')
                .setDescription('The store to fetch deals from')
                .addChoices(
                    { name: 'Steam', value: 'steam' },
                    { name: 'GOG', value: 'gog' },
                    { name: 'Epic Games', value: 'epic' }
                ))
        .addIntegerOption(option =>
            option.setName('max_price')
                .setDescription('Maximum price in USD')),
                
    async execute(interaction) {
        await interaction.deferReply();
        
        const store = interaction.options.getString('store') || 'steam';
        const upperPrice = interaction.options.getInteger('max_price') || 50;
        
        try {
            const deals = await cheapSharkAPI.getDeals({ store, upperPrice, pageSize: 5 });
            
            if (deals.length === 0) {
                return await interaction.editReply('No deals found matching your criteria!');
            }
            
            const embeds = await Promise.all(deals.map(deal => embedGenerator(deal)));
            await interaction.editReply({ embeds });
            
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to fetch deals. Please try again later.');
        }
    },
};
