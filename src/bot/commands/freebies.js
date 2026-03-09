// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const epicGamesAPI = require('../../api/epic');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('freebies')
        .setDescription('Get currently free games on Epic Games Store.'),
                
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            const games = await epicGamesAPI.getFreeGames();
            
            if (games.length === 0) {
                return await interaction.editReply('No free games found at the moment!');
            }
            
            const embeds = games.map(game => {
                return new EmbedBuilder()
                    .setTitle(game.title)
                    .setURL(game.url)
                    .setDescription(game.description || 'No description available.')
                    .setImage(game.thumb)
                    .setColor(0x000000)
                    .addFields({ name: 'Original Price', value: game.originalPrice || 'Free' })
                    .setFooter({ text: 'Epic Games Store Freebie' })
                    .setTimestamp();
            });
            
            await interaction.editReply({ embeds });
            
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to fetch free games. Please try again later.');
        }
    },
};
