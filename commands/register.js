const {  SlashCommandSubcommandBuilder } = require('discord.js');
const { database ,save, loadedData} = require('../index');
const { registerNewGuild, isNewGuild } = require('./util/newGuild');
const { fetch } = require('./util/loadIcs');
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
		if ( isNewGuild(interaction) ) {
            registerNewGuild(interaction);
        }

        // get information
        const role = interaction.options.getString('role');
        const link = interaction.options.getString('link');

        // save the entry of pair role : {link , filename}
        database[interaction.guild.id]["roles"][role] = {};
        database[interaction.guild.id]["roles"][role]["link"] = link;
        database[interaction.guild.id]["roles"][role]["file"] = "./data/" + role + link.split("/").pop() + ".json";
        database[interaction.guild.id]["roles"][role]["option_rules"] = {};
        database[interaction.guild.id]["roles"][role]["except"] = [];
        
        // save the database
        save(database);

        // load and save the ics
        loadedData[role] = {} ;
        await fetch(database[interaction.guild.id]["roles"][role]["link"],database[interaction.guild.id]["roles"][role]["file"],loadedData[role]);

        console.log(loadedData);
        await interaction.reply("Successfuly register the role for the link on your guild");
	}
}