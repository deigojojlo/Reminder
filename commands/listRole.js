const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");
const { isNewGuild } = require("./util/newGuild");
const { database } = require("..");
const { getAcceptedRole } = require("./util/edtUtil");
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');

module.exports = {
    data : new SlashCommandSubcommandBuilder()
    .setName("listrole")
    .setDescription("Give the list of the role"),
    async execute(interaction){
        if (isNewGuild(interaction,database)){
            await interaction.reply("Ce serveur n'est pas enregistré. Pour l'enregister utilisez /edt register");
            return;
        }
        const acceptedRoles = getAcceptedRole(interaction,database);

        /* response */
        var text = "";
        
        for (const role of acceptedRoles){
            const roleName = interaction.guild.roles.cache.get(role).name;
            text += `- ${roleName}`;
        }

        if (text == ""){
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des roles", value : "il n'y a aucun role d'enregistré"})]})
        } else {
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des roles", value : text})]})
        }
    }
}