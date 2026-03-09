// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');
const cheapSharkAPI = require('../../api/cheapshark');
const embedGenerator = require('../../utils/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('search')
        .setDescription('Search for a specific game deal.')
        .addStringOption(option =>
            option.setName('title')
                .setDescription('The name of the game to search for')
                .setRequired(true)),
                
    async execute(interaction) {
        await interaction.deferReply();
        
        const title = interaction.options.getString('title');
        
        try {
            const games = await cheapSharkAPI.searchGame(title);
            
            if (games.length === 0) {
                return await interaction.editReply(`No results found for "${title}".`);
            }
            
            // Get the first result's cheapest deal
            const gameID = games[0].gameID;
            const response = await axios.get(`https://www.cheapshark.com/api/1.0/games?id=${gameID}`);
            
            if (!response.data || !response.data.deals) {
                return await interaction.editReply(`Found "${games[0].external}", but no active deals were found.`);
            }

            const gameData = response.data;
            
            if (!gameData.deals || gameData.deals.length === 0) {
                return await interaction.editReply(`Found "${games[0].external}", but no active deals were found.`);
            }
            
            // Get the best current deal
            const bestDeal = gameData.deals[0];
            const dealLookup = await cheapSharkAPI.getDealLookup(bestDeal.dealID);
            
            const embed = await embedGenerator({
                title: games[0].external,
                salePrice: parseFloat(bestDeal.price),
                normalPrice: parseFloat(bestDeal.retailPrice),
                savings: Math.round(parseFloat(bestDeal.savings)),
                thumb: games[0].thumb,
                metacriticScore: dealLookup.gameInfo.metacriticScore,
                steamAppID: dealLookup.gameInfo.steamAppID,
                storeID: bestDeal.storeID,
                cheapestEver: dealLookup.cheapestPrice
            });
            
            await interaction.editReply({ embeds: [embed] });
            
        } catch (error) {
            console.error(error);
            await interaction.editReply('An error occurred while searching for the game.');
        }
    },
};
