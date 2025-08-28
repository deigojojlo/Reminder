const { SlashCommandBuilder } = require('discord.js');
const register = require("./register");
const addexception = require("./addException.js");
const reload = require("./reload");
const addOption = require('./addOption');
const edtDay = require('./edtDay.js');
const edtNext = require('./edtNext.js');
const listExcept = require('./listExcept.js');
const listOption = require('./listOption.js');
const deleteOption = require('./deleteOption.js');
const deleteexception = require('./deleteExcept.js');
const listRole = require('./listRole.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('edt')
		.setDescription('tr')
		.addSubcommand(register.data)
		.addSubcommand(addexception.data)
		.addSubcommand(reload.data)
		.addSubcommand(edtDay.data)
		.addSubcommand(edtNext.data)
		.addSubcommand(addOption.data)
		.addSubcommand(listExcept.data)
		.addSubcommand(listOption.data)
		.addSubcommand(deleteOption.data)
		.addSubcommand(deleteexception.data)
		.addSubcommand(listRole.data),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand == 'register') {
			await require('./register').execute(interaction);
			return;
		} else if (subcommand == 'day') {
			await edtDay.execute(interaction);
			return ;
		} else if (subcommand == 'next'){
			await edtNext.execute(interaction);
			return ;
		} else if (subcommand == 'listrole'){
			await listRole.execute(interaction);
			return ;
		} else if (subcommand == 'listexcept') {
			await listExcept.execute(interaction);
			return ;
		} else if (subcommand == 'listoptions') {
			await listOption.execute(interaction);
			return ;
		}
		
		if (interaction.guild.ownerId != interaction.user.id ) {
			await interaction.reply('Vous n\'etes pas autorisé à faire ceci');
			return;
		}

		if (subcommand == 'deleteoption'){
			await deleteOption.execute(interaction);
		} else if (subcommand == 'deleteexception'){
			await deleteexception.execute(interaction);
		} else if (subcommand == 'addoption'){
			await addOption.execute(interaction);
		} else if (subcommand == 'addexception') {
			await addexception.execute(interaction);
		}
	},
};