// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { EmbedBuilder } = require('discord.js');
const currencyService = require('../services/currency');

/**
 * Utility to create a rich deal embed.
 */
module.exports = async (deal) => {
    const salePriceINR = await currencyService.convertToINR(deal.salePrice);
    const normalPriceINR = await currencyService.convertToINR(deal.normalPrice);
    
    const isHistoricalLow = deal.salePrice <= parseFloat(deal.cheapestEver?.price || deal.salePrice);
    const badge = isHistoricalLow ? '🔥 **WORTH IT! (Historical Low)**\n' : '';
    const currencyDisclaimer = '*Note: Prices in INR are estimates based on real-time rates and may vary.*\n\n';

    const embed = new EmbedBuilder()
        .setTitle(deal.title)
        .setURL(deal.steamAppID ? `https://store.steampowered.com/app/${deal.steamAppID}` : null)
        .setDescription(`${badge}${currencyDisclaimer}Current Sale Price: **${salePriceINR}**\nNormal Price: ~~${normalPriceINR}~~ (${deal.savings}% Off)`)
        .addFields(
            { name: 'Metacritic', value: deal.metacriticScore || 'N/A', inline: true },
            { name: 'Store', value: deal.storeID === '1' ? 'Steam' : (deal.storeID === '7' ? 'GOG' : 'Epic'), inline: true }
        )
        .setImage(deal.thumb)
        .setColor(isHistoricalLow ? 0xFF4500 : 0x00AE86)
        .setFooter({ text: 'Powered by CheapShark | Developed with ❤️' })
        .setTimestamp();

    return embed;
};
