const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('test')
		.setDescription('test'),
	async execute(interaction) {
        console.log("test");
		try {
            await interaction.reply("Commande test exécutée !");
        } catch (error) {
            console.error("Erreur dans la commande test :", error);
            await interaction.reply({
                content: "Une erreur est survenue.",
                ephemeral: true,
            });
        }
    }
}