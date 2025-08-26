const { SlashCommandBuilder } = require('discord.js');
const register = require("./register");
const ignore = require("./ignore");
const reload = require("./reload");
const addOption = require('./addOption');
const edtDay = require('./edtDay.js');
const edtNext = require('./edtNext.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('edt')
		.setDescription('tr')
		.addSubcommand(register.data)
		.addSubcommand(ignore.data)
		.addSubcommand(reload.data)
		.addSubcommand(edtDay.data)
		.addSubcommand(edtNext.data)
		.addSubcommand(addOption.data),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand == 'register') {
			await require('./register').execute(interaction);
		} else if (subcommand == 'ignore') {
			await ignore.execute(interaction);
		} else if (subcommand == 'day') {
			await edtDay.execute(interaction);
		} else if (subcommand == 'next'){
			await edtNext.execute(interaction);
		} else if (subcommand == 'addoption'){
			await addOption.execute(interaction);
		}
	},
};