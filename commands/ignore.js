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
			.setRequired(true))
		.addStringOption( option =>
			option.setName('role')
			.setDescription('the edt role who ignore the event')
			.setRequired(true)
		),
	async execute(interaction) {
		if ( isNewGuild(interaction)) {
			await interaction.reply("Votre serveur n'est pas enregistré. Enregistrer un role avec un ics avec /edt register");
			return;
		}

		const ignore = interaction.options.getString('name');
		const role = interaction.options.getString('role');
		database[interaction.guild.id].roles[role]["except"].push(ignore);
		save(database);

		await interaction.reply(`ignoring event : ${ignore}`);
	}
}