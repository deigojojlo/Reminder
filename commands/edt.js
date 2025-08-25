const { SlashCommandBuilder } = require('discord.js');
const register = require("./register");
const ignore = require("./ignore");
const reload = require("./reload");
const addOption = require('./addOption');
const edtDay = require('./edtDay.js');
module.exports = {
	data: new SlashCommandBuilder()
		.setName('edt')
		.setDescription('tr')
		.addSubcommand(register.data)
		.addSubcommand(ignore.data)
		.addSubcommand(reload.data)
		.addSubcommand(edtDay.data),
	async execute(interaction) {
		const subcommand = interaction.options.getSubcommand();
		if (subcommand == 'register') {
			await require('./register').execute(interaction);
		} else if (subcommand == 'ignore') {
			await require('./ignore').execute(interaction);
		} else if (subcommand == 'day') {
			await edtDay.execute(interaction);
		}
	},
};