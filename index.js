const {  Client,REST, Routes,  GatewayIntentBits, Collection , Events} = require('discord.js');
const { clientId, guildId, token , channelId} = require('./config.json');
const { fetch } = require('./commands/util/loadIcs');
const { load_database, loadCommands } = require('./commands/util/edtUtil');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages, // Pour lire les messages
		GatewayIntentBits.MessageContent, // Pour lire le contenu des messages
    GatewayIntentBits.GuildPresences
	],
});
client.commands = new Collection();
const database = load_database('./data.json');
const loadedData = {};
console.log(database);
module.exports = {loadedData,database};

const commands = loadCommands(client);
const rest = new REST({ version: '10' }).setToken(token);
(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(clientId,guildId),
            { body: commands },
        );
        console.log('Commandes enregistrées avec succès !');
    } catch (error) {
        console.error(error);
    }
})();

client.on('clientReady', async () => {
    console.log(`Bot connecté en tant que ${client.user.tag}`);
	console.log(database);
	for (const [guildId,guildData] of Object.entries(database)) {
		console.log(guildData);
		for (const [role, value] of Object.entries(guildData.Entry)) {
			console.log(value);
			loadedData[role] = [] ;
			await fetch(value.Link,value.File,loadedData[role]);
		}
	}

	try {
		const guild = await client.guilds.fetch(guildId);
		if (!guild) {
			throw new Error("Guilde non trouvée.");
		}

		const channel = await guild.channels.fetch(channelId);
		if (!channel || !channel.isTextBased()) {
			throw new Error("Salon textuel non trouvé ou inaccessible.");
		}

		await channel.send("Bonjour ! Je suis prêt à être utilisé.");
			console.log("Message envoyé avec succès.");
	} catch (error) {
		console.error("Erreur :", error.message);
	}
});


client.on(Events.InteractionCreate, async interaction => {
    console.log("interaction");
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', flags: MessageFlags.Ephemeral });
		}
	}
});

client.login(token);