const { SlashCommandSubcommandBuilder } = require('discord.js');
const { database } = require('../index');
const { isNewGuild } = require('./util/newGuild');
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');
const { save } = require('./util/edtUtil');
module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('addexception')
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
		if ( isNewGuild(interaction,database)) {
			await interaction.reply("Votre serveur n'est pas enregistré. Enregistrer un role avec un ics avec /edt register");
			return;
		}

		const ignore = interaction.options.getString('name');
		const role = interaction.options.getString('role');
		const entry = getGuildEntry(database,interaction)[role];
		entry.Except = entry.Except || [];
		entry.Except.push(ignore);
		save(database);

		await interaction.reply(`ignoring event : ${ignore}`);
	}
}