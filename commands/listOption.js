const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");
const { isNewGuild } = require("./util/newGuild");
const { database } = require("..");
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');

module.exports = {
    data : new SlashCommandSubcommandBuilder()
    .setName("listoptions")
    .setDescription("Give the list of the options")
    .addStringOption( option =>
        option.setName("role")
        .setDescription("the role of the ics option")
        .setRequired(true)
    ),
    async execute(interaction){
        if (isNewGuild(interaction,database)){
            await interaction.reply("Ce serveur n'est pas enregistré. Pour l'enregister utilisez /edt register");
            return;
        }
        const role = interaction.options.getString("role");
        if (!Object.keys(getGuildEntry(database,interaction)).includes(role)){
            await interaction.reply("Ce role n'est pas enregistré. Pour l'enregister utilisez /edt register");
            return
        }

        /* response */
        const options = getOption(database,interaction,role);
        var text = "";
        
        for (const [role,option] of Object.entries(options)){
            const roleName = interaction.guild.roles.cache.get(role).name;
            text += `- ${roleName} : ${option}`;
        }

        if (options.length == 0){
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des options", value : "il n'y a aucune option d'enregistrée"})]})
        } else {
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des options", value : text})]})
        }
    }
}