const {  Client,REST, Routes,  GatewayIntentBits, Collection , Events} = require('discord.js');
const { clientId, guildId, token , channelId} = require('./config.json');
const fs = require('node:fs');
const path = require('node:path');
const { fetch } = require('./commands/util/loadIcs');
const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages, // Pour lire les messages
		GatewayIntentBits.MessageContent, // Pour lire le contenu des messages
    GatewayIntentBits.GuildPresences
	],
});
client.commands = new Collection();


function load_database() {
	var jsonData
	try {
		const data = fs.readFileSync('./data.json', 'utf8');
		jsonData = JSON.parse(data);
	} catch (err) {
		console.error('Erreur:', err);
	}
	return jsonData
}
const database = load_database();
const loadedData = {};

function loadCommands() {
    const commands = [] ;
    const foldersPath = path.join(__dirname, 'commands');
    const items = fs.readdirSync(foldersPath);

    const edt = require("./commands/edt");
    const test = require("./commands/test");
    commands.push(edt.data.toJSON());
    commands.push(test.data.toJSON());
    client.commands.set(test.data.name, test);
    client.commands.set(edt.data.name,edt);
    
    return commands;
}

function save(database) {
	const jsonString = JSON.stringify(database, null, 2);

	// Write to a file
	fs.writeFile('data.json', jsonString, (err) => {
		if (err) {
			console.error('Error writing file:', err);
		} else {
			console.log('JSON file saved successfully!');
		}
	});
}

module.exports = { database , save , loadedData}








const commands = loadCommands();
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

	for (const [guildId,guildData] of Object.entries(database)) {
		console.log(guildData);
		for (const [role, value] of Object.entries(guildData["roles"])) {
			console.log(value);
			loadedData[role] = [] ;
			await fetch(value["link"],value["file"],loadedData[role]);
		}
	}
    console.log("loadedData");
	console.log(loadedData);



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