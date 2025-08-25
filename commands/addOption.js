const { SlashCommandSubcommandBuilder} = require('discord.js');
const { isNewGuild } = require('./util/newGuild');
const { database, save } = require('../index');
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
        if (isNewGuild(interaction)) {
            await interaction.reply("Your guild is not register, register it first with /edt register");
        } else {
            const role = interaction.option.getString("roleId");
            const optionRole = interaction.option.getString('optionRole');
            const optionName = interaction.option.getString('optionName');
            database[interaction.guild.id]["roles"][role][option_rules][optionName] = optionRole;
            save(database);
        }
    }
}