// Created by Alberto Drake | GitHub: https://github.com/albertodrake
const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('developer')
        .setDescription('Information about the bot developer and how to support the project.'),
                
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('👨‍💻 About the Developer')
            .setDescription(`Hello! I'm **Alberto Drake**, the developer of this Discord Game Deals Bot. 🎮\n\nYou can find me on GitHub: [github.com/albertodrake](https://github.com/albertodrake)`)
            .addFields(
                { name: '🚀 Project Goal', value: 'Providing the most accurate real-time game deals with currency conversion and historical low tracking.' },
                { name: '🛠️ Built With', value: 'Node.js, Discord.js, and CheapShark API.' },
                { name: '🌟 Support', value: 'If you like this bot, please consider giving it a star on GitHub or sharing it with your friends!' }
            )
            .setColor(0x5865F2)
            .setFooter({ text: 'Created by Alberto Drake' })
            .setTimestamp();
            
        await interaction.reply({ embeds: [embed] });
    },
};
