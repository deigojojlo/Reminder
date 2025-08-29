const { SlashCommandSubcommandBuilder } = require("discord.js");
const { execute } = require("./register");
const { isNewGuild, registerNewGuild } = require("./util/newGuild");
const { database } = require("..");
const { setAdminRole } = require("./util/databaseUtil");

module.exports = {
    data :
    new SlashCommandSubcommandBuilder()
    .setName("setadminrole")
    .setDescription("Set a role authorized to manage the register")
    .addStringOption( option =>
        option.setName("role")
        .setDescription("the admin role")
        .setRequired(true)
    ),
    async execute(interaction){
        if (isNewGuild(interaction,database)) {
            registerNewGuild(interaction,database);
        }

        const role = interaction.options.getString("role");
        setAdminRole(interaction,database,role);

        await interaction.reply("enregistrement reussi");
    }
}