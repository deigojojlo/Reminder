const { SlashCommandSubcommandBuilder } = require('discord.js');
const { database, loadedData } = require('../index');
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');
const { isNewGuild } = require('./util/newGuild');

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
		if (isNewGuild(interaction,database)) {
            await interaction.reply("This guild is not register");
        }

        const role = interaction.options.getString('role');
        if (role != null && Object.keys(database[interaction.guild]['roles']).includes(role) )  {
            const value = database[interaction.guild.id].roles[role];
            await fetch(value.link,value.file,loadedData[role]);
            await interaction.reply('L\ics a été rechargé');
            return;
        }

        await interaction.reply('Le role ne correspond pas à un ics enregistré');
	}
}