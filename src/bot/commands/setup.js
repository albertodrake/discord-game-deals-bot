// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require('discord.js');
const dbService = require('../../services/db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup')
// ... (rest of the command data remains same)
        .setName('setup')
        .setDescription('Configure channels for auto-uploading deals and freebies.')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option.setName('deals_channel')
                .setDescription('Channel where daily deals will be posted')
                .addChannelTypes(ChannelType.GuildText))
        .addChannelOption(option =>
            option.setName('freebies_channel')
                .setDescription('Channel where free games will be posted')
                .addChannelTypes(ChannelType.GuildText))
        .addIntegerOption(option =>
            option.setName('min_savings')
                .setDescription('Minimum savings percentage for deals (e.g., 50 for 50% off)')
                .addChoices(
                    { name: '25% Off', value: 25 },
                    { name: '50% Off', value: 50 },
                    { name: '75% Off', value: 75 },
                    { name: '100% Off', value: 100 }
                )),
                
    async execute(interaction) {
        await interaction.deferReply({ flags: [4096] }); // 4096 is the bitwise value for Ephemeral
        
        const dealsChannel = interaction.options.getChannel('deals_channel');
        const freebiesChannel = interaction.options.getChannel('freebies_channel');
        const minSavings = interaction.options.getInteger('min_savings');
        
        if (!dealsChannel && !freebiesChannel && minSavings === null) {
            return await interaction.editReply('Please specify at least one option to set up!');
        }
        
        try {
            const updateData = {};
            let message = 'Configuration updated:\n';
            
            if (dealsChannel) {
                updateData.dealsChannelId = dealsChannel.id;
                message += `- Daily Deals: <#${dealsChannel.id}>\n`;
            }
            
            if (freebiesChannel) {
                updateData.freebiesChannelId = freebiesChannel.id;
                message += `- Freebies: <#${freebiesChannel.id}>\n`;
            }
            
            if (minSavings !== null) {
                updateData.minSavings = minSavings;
                message += `- Minimum Savings: **${minSavings}% Off**\n`;
            }
            
            await dbService.updateSettings(interaction.guildId, updateData);
            
            await interaction.editReply(message);
            
        } catch (error) {
            console.error('Error in /setup command:', error);
            await interaction.editReply('An error occurred while saving the configuration to the database.');
        }
    },
};
