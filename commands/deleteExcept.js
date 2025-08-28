const { SlashCommandSubcommandBuilder } = require("discord.js");
const { execute } = require("./register");
const { isNewGuild } = require("./util/newGuild");
const { database } = require("..");
const { save } = require("./util/edtUtil");
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');

module.exports = {
    data :
    new SlashCommandSubcommandBuilder()
    .setName('deleteexception')
    .setDescription('remove an exception from a ics role')
    .addStringOption( option =>
        option.setName('roleid')
        .setDescription('the id of the ics role')
        .setRequired(true)
    )
    .addStringOption( option =>
        option.setName('exception')
        .setDescription('the summary of the exception to delete')
    ),
    async execute(interaction){
        if (isNewGuild(interaction,database)){
            await interaction.reply('Vous n\'avez aucun ics enregistré sur le serveur. Utilisez /edt register ');
            return;
        }

        const role = interaction.options.getString('roleid');
        const exception = interaction.options.getString('exception')
        const isRole = getGuildEntry(database,interaction)[role] != undefined;
        if (!isRole){
            interaction.reply('le role n\'est pas enregisté');
            return;
        }
        if (exception == undefined){
            getGuildEntry(database,interaction)[role].Except = [];
            save(database);
            interaction.reply('Toute les exceptions ont été retirées');
        } else {
            const exceptions = getExcept(database,interaction,role);
            const previusLength =exceptions.length;
            exceptions.splice(exceptions.indexOf([exception]),1);
            if (previusLength == exceptions.length){
                interaction.reply('L\'exception n\'existe pas');
                return;
            } else {
                interaction.reply('L\"exception a été supprimée');
            }
        }

    }
}