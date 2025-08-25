const { SlashCommandSubcommandBuilder } = require('discord.js');
const { database , save} = require('../index');
const { registerNewGuild, isNewGuild } = require('./util/newGuild');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('ignore')
		.setDescription('add an event name to don\'t use in the calendar')
		.addStringOption( option =>
            option.setName('name')
            .setDescription('the event name to ignore')
			.setRequired(true)
        ),
	async execute(interaction) {
		if ( isNewGuild(interaction)) {
			registerNewGuild(interaction);
		}

		const ignore = interaction.options.getString('name');
		database[interaction.guild.id]["except"] += [ignore];
		save(database);

		await interaction.reply(`ignoring event : ${ignore}`);
	}
}