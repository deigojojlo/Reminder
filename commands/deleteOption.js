const { SlashCommandSubcommandBuilder } = require("discord.js");
const { isNewGuild } = require("./util/newGuild");
const { database} = require("..");
const { save } = require("./util/edtUtil");
const {getGuild,getGuildEntry,getExcept,getOption,getAdminRole,getGuildId,getGuildRoles,getGuildOwner,getAuthorId} = require('./util/databaseUtil');

function isOptionRole(guildRoles,role){
    for ( const [parentRole,value] of Object.entries(guildRoles)){
        if (Object.keys(value.Option).includes(role)){
            return true;
        }
    }
    return false;
}

function getParentOfOption(guildRoles,role){
    for ( const [parentRole,value] of Object.entries(guildRoles)){
        if (Object.keys(value.Option).includes(role)){
            return parentRole;
        }
    }
}

module.exports = {
    data : new SlashCommandSubcommandBuilder()
    .setName("deleteoption")
    .setDescription("delete an option")
    .addStringOption( option =>
        option.setName("roleid")
        .setDescription("the role of the option to delete")
        .setRequired(true)
    ),
    async execute(interaction){
        console.log("exec");
        const role = interaction.options.getString("roleid");
        if (isNewGuild(interaction,database) ||  !isOptionRole(getGuildEntry(database,interaction),role)) {
            await interaction.reply("Ce role n'est pas associé à une option");
            return;
        }

        const parent = getParentOfOption(getGuildEntry(database,interaction),role);
        delete getOption(database,interaction,parent)[role];

        await interaction.reply("L'option a bien été retiré");
        save(database);
    }
}