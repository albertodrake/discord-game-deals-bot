// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType } = require('discord.js');
const cheapSharkAPI = require('../../api/cheapshark');
const embedGenerator = require('../../utils/embedGenerator');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('all')
        .setDescription('Browse all current game deals with pagination.'),
                
    async execute(interaction) {
        await interaction.deferReply();
        
        try {
            const deals = await cheapSharkAPI.getDeals({ sortBy: 'Savings', pageSize: 50 });
            
            if (deals.length === 0) {
                return await interaction.editReply('No deals found!');
            }
            
            let currentPage = 0;
            const itemsPerPage = 3;
            const totalPages = Math.ceil(deals.length / itemsPerPage);

            const generateEmbeds = async (page) => {
                const start = page * itemsPerPage;
                const end = start + itemsPerPage;
                const pageDeals = deals.slice(start, end);
                return await Promise.all(pageDeals.map(deal => embedGenerator(deal)));
            };

            const generateButtons = (page) => {
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('prev')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === 0),
                        new ButtonBuilder()
                            .setCustomId('next')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(page === totalPages - 1)
                    );
            };

            const response = await interaction.editReply({
                content: `Showing page ${currentPage + 1} of ${totalPages}`,
                embeds: await generateEmbeds(currentPage),
                components: [generateButtons(currentPage)]
            });

            const collector = response.createMessageComponentCollector({ componentType: ComponentType.Button, time: 300000 });

            collector.on('collect', async i => {
                if (i.customId === 'prev') currentPage--;
                else if (i.customId === 'next') currentPage++;

                await i.update({
                    content: `Showing page ${currentPage + 1} of ${totalPages}`,
                    embeds: await generateEmbeds(currentPage),
                    components: [generateButtons(currentPage)]
                });
            });

            collector.on('end', () => {
                interaction.editReply({ components: [] });
            });
            
        } catch (error) {
            console.error(error);
            await interaction.editReply('Failed to browse deals. Please try again later.');
        }
    },
};
