const { SlashCommandSubcommandBuilder} = require('discord.js');
const { isNewGuild } = require('./util/newGuild');
const { database } = require('../index');
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');
const { save } = require('./util/edtUtil');

module.exports = {
    data : new SlashCommandSubcommandBuilder()
    .setName("addoption")
    .setDescription("add an option to your planning")
    .addStringOption( option =>
        option.setName("targetedrole")
        .setDescription("the targeted role wich suffered the option")
        .setRequired(true)
    )
    .addStringOption( option =>
        option.setName("optrole")
        .setDescription("the role for the option")
        .setRequired(true)
    )
    .addStringOption( option =>
        option.setName("optname")
        .setDescription("the title of the option")
        .setRequired(true)
    ),
    async execute(interaction) {
        if (isNewGuild(interaction,database)) {
            await interaction.channel.send("Your guild is not register, register it first with /edt register");
        }

        const role = interaction.options.getString('targetedrole');
        const optionRole = interaction.options.getString('optrole');
        const optionName = interaction.options.getString('optname');
        console.log("recuperation des data ok");
        
        // init if empty
        const entry = getGuildEntry(database,interaction)[role];
        entry.Option[optionRole] = entry.Option[optionRole] || [] ;
        // add the option summary
        entry.Option[optionRole].push(optionName)
        
        console.log("debut de la save");
        save(database);
        console.log("fin de la save");
        await interaction.reply(" Enregistrement reussi");
        
    }
}