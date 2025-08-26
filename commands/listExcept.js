const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");
const { isNewGuild } = require("./util/newGuild");
const { database } = require("..");

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
        if (isNewGuild(interaction)){
            await interaction.reply("Ce serveur n'est pas enregistré. Pour l'enregister utilisez /edt register");
            return;
        }
        const role = interaction.options.getString("role");
        if (!Object.keys(database[interaction.guild.id].roles).includes(role)){
            await interaction.reply("Ce role n'est pas enregistré. Pour l'enregister utilisez /edt register");
            return
        }

        /* response */

        const except = database[interaction.guild.id].roles[role].except;
        var text = "";

        except.forEach(exception => {
            text += `- ${exception}`;
        });

        if (except.length == 0){
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des exceptions", value : "il n'y a aucune exception d'enregistré"})]})
        } else {
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des exceptions", value : text})]})
        }
    }
}