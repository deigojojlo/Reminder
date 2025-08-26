const { SlashCommandSubcommandBuilder, EmbedBuilder } = require("discord.js");
const { isNewGuild } = require("./util/newGuild");
const { database } = require("..");

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

        const options = database[interaction.guild.id].roles[role].option_rules;
        var text = "";
        
        for (const [role,option] of Object.entries(options)){
            const roleName = interaction.guild.roles.cache.get(role).name;
            text += `- ${roleName} : ${option}`;
        }

        if (options.length == 0){
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des options", value : "il n'y a aucune option d'enregistré"})]})
        } else {
            await interaction.reply({embeds : [new EmbedBuilder().addFields({name:"liste des options", value : text})]})
        }
    }
}