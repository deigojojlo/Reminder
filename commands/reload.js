const { SlashCommandSubcommandBuilder } = require('discord.js');
const { database } = require('../index');
module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('reload')
		.setDescription('fetch all origin and update all data if no guild role is specified')
		.addStringOption( option =>
            option.setName('role')
            .setDescription('the guild role id of the reloaded origin')
            .setRequired(false)
        ),
	async execute(interaction) {
		if ( interaction.guild != null && !(interaction.guild in Object.keys(database))) {
            await interaction.reply("This guild is not register");
        }

        const role = interaction.options.getString('role');
        if (role != null && role in Object.keys(database[interaction.guild]['roles'])) {
            // reload database[interaction.guild]['roles'][role]
        }
	}
}