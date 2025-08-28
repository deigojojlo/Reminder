const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");
const { isNewGuild } = require("./util/newGuild");
const { database } = require("..");
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');

module.exports = {
    data : new SlashCommandSubcommandBuilder()
    .setName("listexcept")
    .setDescription("Give the list of the exception")
    .addStringOption( option =>
        option.setName("role")
        .setDescription("the role of the exceptions")
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
        const except = getExcept(database,interaction,role);
        var text = "";

        except.forEach(exception => {
            text += `- ${exception}`;
        });

        if (except.length == 0){
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des exceptions", value : "il n'y a aucune exception d'enregistrée"})]})
        } else {
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des exceptions", value : text})]})
        }
    }
}