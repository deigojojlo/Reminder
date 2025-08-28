const {  SlashCommandSubcommandBuilder } = require('discord.js');
const { save} = require('./util/edtUtil');
const { registerNewGuild, isNewGuild } = require('./util/newGuild');
const { fetch } = require('./util/loadIcs');
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');
const { database, loadedData} = require('./../index');

module.exports = {
	data: new SlashCommandSubcommandBuilder()
		.setName('register')
		.setDescription('tzes')
		.addStringOption( option =>
            option.setName('role')
            .setDescription('the guild role id')
            .setRequired(true)
        )
        .addStringOption( option =>
            option.setName('link')
            .setDescription('the link to the ics')
            .setRequired(true)
        ),
	async execute(interaction) {
        // for new only on guild
		if ( isNewGuild(interaction,database) ) {
            registerNewGuild(interaction,database);
        }
        console.log(database);
        // get information
        const role = interaction.options.getString('role');
        const link = interaction.options.getString('link');

        // save the entry of pair role : {link , filename}
        const data =  getGuildEntry(database,interaction);
        data[role] = {};
        const roleData = data[role];
        roleData.Link = link;
        roleData.File = "./data/" + role + link.split("/").pop() + ".json";
        roleData.Option = {};
        roleData.Except = [];
        getGuild(database,interaction).AdminRole = "";
        
        // save the database
        save(database);

        // load and save the ics
        loadedData[role] = {} ;
        await fetch(roleData.Link,roleData.File,loadedData[role]);

        console.log(loadedData);
        await interaction.reply("Successfuly register the role for the link on your guild");
	}
}