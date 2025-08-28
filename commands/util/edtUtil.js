const fs = require('node:fs');
const path = require('node:path');
const { getGuildEntry } = require('./databaseUtil');

function isException(event,exceptions){
	return exceptions.includes(event.Summary);
}

function checkOption(event,roles,options){
	var isInOption = false ;
	for (const [optrole,summary] of Object.entries(options)){
		if (event.Summary == summary){
			isInOption = true ;
			if (roles.includes(optrole)){
				return 1 ; // is in option and the author had the role
			}
		}
	}
	if (isInOption)
		return 0; // is in option and the author doesn't had the role
	return -1 // is not an option
}

function getAcceptedRole(interaction,database){
    const roles = interaction.member.roles.cache.map(role => role.id);
    const acceptedRoles = [];

    //search roles for edt
    console.log(roles);
    console.log(database);
    for (const r of roles) {
        console.log(database[interaction.guild.id]);
        if (Object.keys(getGuildEntry(database,interaction)).includes(r))
            acceptedRoles.push(r);
    }
    return acceptedRoles;
}

function load_database(file) {
	var jsonData
	try {
		const data = fs.readFileSync(file, 'utf8');
		jsonData = JSON.parse(data);
	} catch (err) {
		console.error('Erreur:', err);
	}
	return jsonData
}


function loadCommands(client) {
    const commands = [] ;
    const foldersPath = path.join(__dirname, '../../commands');
    const items = fs.readdirSync(foldersPath);

    const edt = require("../../commands/edt");
    const test = require("../../commands/test");
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


module.exports = { isException , checkOption, getAcceptedRole , save ,load_database,loadCommands};